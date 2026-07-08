import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const overrides = JSON.parse(fs.readFileSync(path.join(__dirname, "ko-overrides.json"), "utf8"));

function dedupeRepeatedPhrase(text) {
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length >= 2 && parts.length % 2 === 0) {
    const half = parts.length / 2;
    if (parts.slice(0, half).join(" ") === parts.slice(half).join(" ")) {
      return parts.slice(0, half).join(" ");
    }
  }
  return text;
}

function polishKorean(word, korean) {
  if (overrides[word]) return overrides[word];

  let ko = korean.trim();
  if (!ko) return ko;

  if (ko.includes("거나")) {
    ko = ko.split("거나")[0].trim();
  }

  ko = dedupeRepeatedPhrase(ko);

  if (ko.includes("~")) {
    return overrides[word] ?? ko;
  }

  return ko;
}

function polishFile(filename) {
  const filePath = path.join(root, "src", "data", "vocab", filename);
  const items = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = 0;

  for (const item of items) {
    const next = polishKorean(item.word, item.korean);
    if (next !== item.korean) {
      item.korean = next;
      changed += 1;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  return { total: items.length, changed };
}

const n4 = polishFile("n4.json");
const n3 = polishFile("n3.json");

console.log(`Polished N4: ${n4.changed}/${n4.total}, N3: ${n3.changed}/${n3.total}`);
