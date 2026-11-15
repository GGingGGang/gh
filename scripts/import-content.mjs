import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { markdownFiles } from "./content-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!process.argv[2])
  throw Error('Usage: npm run import:content -- "path/to/materials" [B C D]');
const source = path.resolve(process.argv[2]);
if (fs.realpathSync(source) === fs.realpathSync(root))
  throw Error("Choose the original materials folder, not this repository.");
const groups = process.argv.length > 3 ? process.argv.slice(3) : ["B", "C", "D"];
if (groups.some((group) => !["A", "B", "C", "D", "F"].includes(group)))
  throw Error("Expected group names A, B, C, D or F.");

// Read all sources before changing any publication copy.
const documents = groups.flatMap((group) =>
  markdownFiles(path.join(source, group)).map((relative) => ({
    group,
    relative,
    content: fs.readFileSync(path.join(source, group, relative)),
  })),
);
for (const { group, relative } of documents) {
  let target = root;
  for (const part of [group, ...relative.split("/")]) {
    target = path.join(target, part);
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      throw Error("Refusing a linked publication path: " + target);
  }
}
for (const { group, relative, content } of documents) {
  const target = path.join(root, group, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
let removed = 0;
for (const group of groups) {
  const directory = path.join(root, group);
  const included = new Set(
    documents.filter((d) => d.group === group).map((d) => d.relative),
  );
  if (!fs.existsSync(directory)) continue;
  for (const relative of markdownFiles(directory)) {
    if (included.has(relative)) continue;
    // Paths come from this publication folder; no original is deleted.
    fs.unlinkSync(path.join(directory, relative));
    removed++;
  }
}
console.log(
  "Imported " + documents.length + " Markdown files unchanged from " +
  groups.join(", ") + "; excluded archive/private folders and non-Markdown files. " +
  "Removed " + removed + " outdated publication copies. Run npm run check; commit public/ with your sources.",
);
