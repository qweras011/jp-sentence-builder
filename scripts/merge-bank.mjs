import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXISTING = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "data.json"), "utf8")
);
const EXISTING_JA = new Set(EXISTING.map((s) => s.japanese));

const batches = [1, 2, 3, 4].map((n) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, `bank-batch-${n}.json`), "utf8"))
);
const bank = batches.flat();

if (bank.length !== 200) {
  throw new Error(`Expected 200 entries, got ${bank.length}`);
}

const seen = new Set();
for (const [i, entry] of bank.entries()) {
  const joined = entry.pieces.map(([t]) => t).join("");
  if (entry.japanese !== joined) {
    throw new Error(`#${i + 1} pieces mismatch: "${entry.japanese}" !== "${joined}"`);
  }
  if (!entry.japanese.endsWith("。")) {
    throw new Error(`#${i + 1} japanese must end with 。`);
  }
  if (!/[.!]$/.test(entry.korean)) {
    throw new Error(`#${i + 1} korean must end with . or !`);
  }
  if (EXISTING_JA.has(entry.japanese)) {
    throw new Error(`#${i + 1} duplicates existing: ${entry.japanese}`);
  }
  if (seen.has(entry.japanese)) {
    throw new Error(`#${i + 1} duplicate in bank: ${entry.japanese}`);
  }
  seen.add(entry.japanese);
}

const out = path.join(__dirname, "sentence-bank.json");
fs.writeFileSync(out, JSON.stringify(bank, null, 2));
console.log(`Wrote ${bank.length} entries to ${out}`);
