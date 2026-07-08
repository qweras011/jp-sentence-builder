import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TARGET_N4 = 600;
const TARGET_N3 = 900;
const CACHE_PATH = path.join(__dirname, "meaning-cache-ko.json");

const SKIP_WORDS = new Set(["あ", "ああ", "ええ", "えー", "うん", "うーん"]);

function hasKanji(text) {
  return /[\u4e00-\u9faf]/.test(text);
}

function isKanaOnly(text) {
  return /^[\u3040-\u309f\u30a0-\u30ffー]+$/.test(text);
}

function normalizeReading(word, reading) {
  if (reading && reading.trim()) {
    return reading.split("/")[0].trim();
  }
  if (isKanaOnly(word)) return word;
  return "";
}

function isEssential(entry) {
  const word = entry.word?.trim();
  if (!word || SKIP_WORDS.has(word)) return false;
  if (!entry.meanings?.length) return false;
  if (word.length === 1 && !hasKanji(word)) return false;
  return true;
}

function essentialScore(entry) {
  let score = 0;
  const word = entry.word;

  if (hasKanji(word)) score += 12;
  if (entry.examples?.length) score += 6;
  if (word.endsWith("する") || word.endsWith("ます")) score += 4;
  if (word.length >= 2 && word.length <= 8) score += 3;
  if (/^[\u30a0-\u30ffー]+$/.test(word)) score += 1;
  if (/^[\u30a0-\u30ffー]+$/.test(word) && word.length > 8) score -= 4;

  const gloss = entry.meanings.join(" ").toLowerCase();
  if (gloss.includes("archaic") || gloss.includes("obsolete")) score -= 8;

  return score;
}

function pickEssential(entries, limit, excludeWords = new Set()) {
  return entries
    .filter(isEssential)
    .filter((entry) => !excludeWords.has(entry.word))
    .sort((a, b) => essentialScore(b) - essentialScore(a) || a.word.localeCompare(b.word, "ja"))
    .slice(0, limit);
}

function glossKey(entry) {
  return entry.meanings.slice(0, 2).join(", ");
}

async function translateMeaning(text, word = "") {
  const cleaned = text
    .replace(/\(.*?\)/g, "")
    .replace(/^to /i, "")
    .trim();

  if (!cleaned) return text;

  try {
    const result = await translate(cleaned, { from: "en", to: "ko" });
    let ko = result.text.replace(/\.$/, "").trim();
    ko = ko.split(/[,，、]/)[0].trim();
    if (word.endsWith("する") && !ko.endsWith("다") && !ko.endsWith("하다")) {
      ko = `${ko}하다`;
    }
    return ko;
  } catch {
    return cleaned;
  }
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

async function fillMeaningCache(entries, cache) {
  const keys = [...new Set(entries.map(glossKey))].filter((key) => !cache.has(key));
  console.log(`Translating ${keys.length} unique meanings (${cache.size} cached)...`);

  for (let i = 0; i < keys.length; i += 1) {
    cache.set(keys[i], await translateMeaning(keys[i], ""));
    if ((i + 1) % 25 === 0 || i === keys.length - 1) {
      console.log(`  translated ${i + 1}/${keys.length}`);
      saveCache(cache);
    }
    await new Promise((r) => setTimeout(r, 60));
  }
}

function toItems(picked, startId, level, cache) {
  return picked.map((entry, index) => ({
    id: startId + index,
    word: entry.word,
    reading: normalizeReading(entry.word, entry.reading),
    korean: cache.get(glossKey(entry)) ?? glossKey(entry),
    level,
  }));
}

async function main() {
  console.log("Building N4/N3 essential vocabulary...");

  const n4Raw = JSON.parse(fs.readFileSync(path.join(__dirname, "source-n4.json"), "utf8"));
  const n3Raw = JSON.parse(fs.readFileSync(path.join(__dirname, "source-n3.json"), "utf8"));

  const n4Picked = pickEssential(n4Raw, TARGET_N4);
  const n4Words = new Set(n4Picked.map((entry) => entry.word));
  const n3Picked = pickEssential(n3Raw, TARGET_N3, n4Words);

  const cache = loadCache();
  await fillMeaningCache([...n4Picked, ...n3Picked], cache);
  saveCache(cache);

  const n4 = toItems(n4Picked, 1, "n4", cache);
  const n3 = toItems(n3Picked, n4.length + 1, "n3", cache);

  const outDir = path.join(root, "src", "data", "vocab");
  fs.writeFileSync(path.join(outDir, "n4.json"), JSON.stringify(n4, null, 2));
  fs.writeFileSync(path.join(outDir, "n3.json"), JSON.stringify(n3, null, 2));

  console.log(`Done: N4 ${n4.length}, N3 ${n3.length}, total ${n4.length + n3.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
