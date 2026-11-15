import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public",
);
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
if (!fs.existsSync(path.join(root, "index.html")))
  throw Error("Run npm run build first");
const server = http.createServer((req, res) => {
  let url;
  try {
    url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (url.split("/").some((part) => part.startsWith("."))) {
    res.writeHead(404);
    res.end();
    return;
  }
  let target = path.resolve(root, "." + url);
  if (!target.startsWith(root + path.sep) && target !== root) {
    res.writeHead(404);
    res.end();
    return;
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory())
    target = path.join(target, "index.html");
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(path.join(root, "404.html")));
    return;
  }
  res.writeHead(200, {
    "Content-Type": types[path.extname(target)] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(target).pipe(res);
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Local: http://127.0.0.1:${server.address().port}`),
);
