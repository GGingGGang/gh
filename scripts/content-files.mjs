import fs from "node:fs";
import path from "node:path";

// Publication is based on location and extension, never a document's title.
export function markdownFiles(directory, recursive = true) {
  if (fs.lstatSync(directory).isSymbolicLink())
    throw Error(`Refusing a linked content folder: ${directory}`);
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!recursive || /^(archive|private)$/i.test(entry.name)) continue;
      for (const relative of markdownFiles(path.join(directory, entry.name)))
        result.push(`${entry.name}/${relative}`);
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      result.push(entry.name);
    }
  }
  return result.sort((a, b) => a.localeCompare(b, "ko"));
}
