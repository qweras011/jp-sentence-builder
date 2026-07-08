import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const EXISTING_PATH = path.join(root, "src", "data", "data.json");
const BANK_PATH = path.join(__dirname, "sentence-bank.json");
const OUT_PATH = path.join(root, "src", "data", "data.json");

function piecesToRuby(pieces) {
  return pieces.map(([text, reading]) => ({ text, reading: reading ?? "" }));
}

function piecesToShuffled(pieces) {
  return pieces.map(([text]) => text);
}

function toSentenceItem(id, entry) {
  const pieces = entry.pieces;
  const japanese = entry.japanese ?? piecesToShuffled(pieces).join("");

  if (entry.japanese && entry.japanese !== piecesToShuffled(pieces).join("")) {
    throw new Error(`id ${id}: japanese mismatch for "${entry.korean}"`);
  }

  return {
    id,
    korean: entry.korean,
    japanese,
    ruby: piecesToRuby(pieces),
    shuffled: piecesToShuffled(pieces),
  };
}

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(EXISTING_PATH, "utf8"));
  } catch {
    return [];
  }
}

function main() {
  const existing = loadExisting();
  const bank = JSON.parse(fs.readFileSync(BANK_PATH, "utf8"));
  const existingIds = new Set(existing.map((item) => item.id));
  const startId = existing.length > 0 ? Math.max(...existing.map((item) => item.id)) + 1 : 1;

  const newItems = bank.map((entry, index) => toSentenceItem(startId + index, entry));
  const merged = [...existing, ...newItems];

  const seenJapanese = new Set();
  for (const item of merged) {
    if (seenJapanese.has(item.japanese)) {
      console.warn(`Duplicate japanese: ${item.japanese}`);
    }
    seenJapanese.add(item.japanese);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(merged, null, 2));
  console.log(`Done: ${existing.length} existing + ${newItems.length} new = ${merged.length} total`);
}

main();
