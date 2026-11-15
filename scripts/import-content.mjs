import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!process.argv[2])
  throw Error('Usage: npm run import:content -- "path/to/국제협상론"');
const source = path.resolve(process.argv[2]);
let count = 0;
for (const group of ["A", "B", "C", "D", "F"]) {
  const from = path.join(source, group);
  const to = path.join(root, group);
  if (!fs.existsSync(from)) throw Error(`Missing source folder: ${group}`);
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    fs.copyFileSync(path.join(from, entry.name), path.join(to, entry.name));
    count++;
  }
}
console.log(
  `Imported ${count} top-level Markdown files. Nested/primary-source files were not copied. Run npm run check; commit public/ with your sources.`,
);
