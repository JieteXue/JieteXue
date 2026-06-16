import { readFileSync, writeFileSync } from "node:fs";

export function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
}

export function updateRegion(file, start, end, html) {
  const source = readFileSync(file, "utf8");
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`${file} is missing ${start} / ${end} markers.`);
  }

  const next =
    source.slice(0, startIndex + start.length) +
    "\n" +
    html +
    "\n" +
    source.slice(endIndex);

  writeFileSync(file, next);
}
