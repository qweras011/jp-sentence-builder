import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const CACHE_PATH = path.join(__dirname, "refine-cache-ko.json");

const overrides = JSON.parse(fs.readFileSync(path.join(__dirname, "ko-overrides.json"), "utf8"));

function loadSourceMap() {
  const n4 = JSON.parse(fs.readFileSync(path.join(__dirname, "source-n4.json"), "utf8"));
  const n3 = JSON.parse(fs.readFileSync(path.join(__dirname, "source-n3.json"), "utf8"));
  const map = new Map();
  for (const entry of [...n4, ...n3]) {
    map.set(entry.word, entry);
  }
  return map;
}

function loadCache() {
  try {
    return new Map(Object.entries(JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"))));
  } catch {
    return new Map();
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(Object.fromEntries(cache), null, 2));
}

function primaryEnglish(entry) {
  const raw = entry?.meanings?.[0] ?? "";
  return raw
    .replace(/\(.*?\)/g, "")
    .replace(/^to /i, "")
    .split(/\s+or\s+/i)[0]
    .trim();
}

function normalizeVerbForm(korean, word, englishRaw) {
  let ko = korean.trim();
  if (!ko) return ko;

  const english = englishRaw ?? "";

  if (word.endsWith("する") && !ko.endsWith("다")) {
    if (ko.endsWith("하다")) return ko;
    if (ko.endsWith("함")) return `${ko.slice(0, -1)}하다`;
    return `${ko}하다`;
  }

  if ((word.endsWith("る") || /^to /i.test(english)) && !ko.endsWith("다") && ko.length <= 4) {
    return ko;
  }

  return ko;
}

function cleanKoreanText(text) {
  let ko = text.replace(/\.$/, "").trim();
  const parts = ko.split(/[,，、]/).map((part) => part.trim()).filter(Boolean);
  const unique = [...new Set(parts)];
  ko = unique[0] ?? ko;

  if (ko.includes("거나")) {
    ko = ko.split("거나")[0].trim();
  }

  const words = ko.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words.length % 2 === 0) {
    const half = words.length / 2;
    if (words.slice(0, half).join(" ") === words.slice(half).join(" ")) {
      ko = words.slice(0, half).join(" ");
    }
  }

  return ko;
}

function needsRefine(item) {
  const k = item.korean;
  return (
    /[a-zA-Z]{2,}/.test(k) ||
    k.includes(",") ||
    k.length > 12 ||
    (item.word.endsWith("する") && !k.endsWith("다")) ||
    (item.word.endsWith("る") && !item.word.endsWith("する") && !k.endsWith("다") && k.length < 8)
  );
}

async function translatePrimary(english, cache) {
  if (!english) return english;
  if (cache.has(english)) return cache.get(english);

  try {
    const result = await translate(english, { from: "en", to: "ko" });
    const ko = cleanKoreanText(result.text);
    cache.set(english, ko);
    await new Promise((r) => setTimeout(r, 50));
    return ko;
  } catch {
    return english;
  }
}

async function refineItem(item, sourceMap, cache) {
  if (overrides[item.word]) {
    return { ...item, korean: overrides[item.word] };
  }

  const source = sourceMap.get(item.word);
  const english = primaryEnglish(source);
  let korean = overrides[item.word] ?? item.korean;

  if (!overrides[item.word] && (needsRefine(item) || !source)) {
    korean = await translatePrimary(english, cache);
    korean = normalizeVerbForm(korean, item.word, source?.meanings?.[0] ?? "");
  }

  korean = cleanKoreanText(korean);
  return { ...item, korean };
}

async function refineFile(filename, sourceMap, cache) {
  const filePath = path.join(root, "src", "data", "vocab", filename);
  const items = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const refined = [];

  for (let i = 0; i < items.length; i += 1) {
    refined.push(await refineItem(items[i], sourceMap, cache));
    if ((i + 1) % 100 === 0) {
      console.log(`  ${filename}: ${i + 1}/${items.length}`);
      saveCache(cache);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(refined, null, 2));
  return refined.length;
}

async function main() {
  console.log("Refining Korean vocabulary glosses...");
  const sourceMap = loadSourceMap();
  const cache = loadCache();

  const n4Count = await refineFile("n4.json", sourceMap, cache);
  saveCache(cache);
  const n3Count = await refineFile("n3.json", sourceMap, cache);
  saveCache(cache);

  console.log(`Done: refined N4 ${n4Count}, N3 ${n3Count}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
