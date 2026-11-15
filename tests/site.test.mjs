import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawn } from "node:child_process";
import { JSDOM } from "jsdom";
import { parseAllDocuments } from "yaml";
import { once } from "node:events";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const info = JSON.parse(
  fs.readFileSync(path.join(publicRoot, "build-info.json"), "utf8"),
);
const read = (relative) =>
  fs.readFileSync(path.join(publicRoot, relative), "utf8");
function walk(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
}

test("all top-level A/B/C/D/F analysis documents are published and originals are excluded", () => {
  for (const group of ["A", "B", "C", "D", "F"])
    for (const entry of fs.readdirSync(path.join(root, group), {
      withFileTypes: true,
    }))
      assert.ok(
        entry.isFile() && entry.name.endsWith(".md"),
        `Unexpected source material: ${group}/${entry.name}`,
      );
  const sources = ["A", "B", "C", "D", "F"].flatMap((group) =>
    fs
      .readdirSync(path.join(root, group), { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => `${group}/${e.name}`),
  );
  assert.deepEqual(
    new Set(info.documents.map((d) => d.source)),
    new Set(sources),
  );
  assert.ok(
    info.documents.some((d) => d.source === "C/독립비판_서브에이전트.md"),
  );
  for (const filename of walk(publicRoot)) {
    const relative = path.relative(publicRoot, filename).replaceAll("\\", "/");
    assert.doesNotMatch(
      relative,
      /(^|\/)(원문|검증자료|검증|1차자료)(\/|$)|\.(pdf|md|png|jpe?g|docx?|pptx?)$/i,
    );
  }
  assert.equal(info.groups.length, 5);
  assert.ok(info.excludedLocalReferences > 0);
});

test("every generated internal href/src and heading fragment resolves", () => {
  let checked = 0;
  for (const filename of walk(publicRoot).filter((f) => f.endsWith(".html"))) {
    const doc = new JSDOM(fs.readFileSync(filename, "utf8")).window.document;
    const page =
      "/" + path.relative(publicRoot, filename).replaceAll("\\", "/");
    for (const element of doc.querySelectorAll("[href],[src]")) {
      const href = element.getAttribute("href") || element.getAttribute("src");
      if (/^(https?:|mailto:|data:)/.test(href)) continue;
      const url = new URL(href, "https://test.invalid" + page);
      let target = path.join(publicRoot, decodeURIComponent(url.pathname));
      if (fs.existsSync(target) && fs.statSync(target).isDirectory())
        target = path.join(target, "index.html");
      assert.ok(fs.existsSync(target), `${page} -> ${href}`);
      if (url.hash && target.endsWith(".html")) {
        const linked =
          target === filename
            ? doc
            : new JSDOM(fs.readFileSync(target, "utf8")).window.document;
        assert.ok(
          linked.getElementById(decodeURIComponent(url.hash.slice(1))),
          `Broken fragment: ${page} -> ${href}`,
        );
      }
      checked++;
    }
    const ids = [...doc.querySelectorAll("[id]")].map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${page}`);
  }
  assert.ok(checked > 500);
});

test("document search and responsive navigation work without external runtime services", async () => {
  const dom = new JSDOM(read("docs/index.html"), {
    url: "https://test.invalid/docs/",
    runScripts: "outside-only",
  });
  const { window: w } = dom;
  const d = w.document;
  w.fetch = async () => ({
    ok: true,
    json: async () => JSON.parse(read("docs/search-index.json")),
  });
  w.eval(read("assets/docs.js"));
  const search = d.getElementById("document-search");
  search.value = "윈셋";
  search.dispatchEvent(new w.Event("input"));
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.ok(d.querySelectorAll(".search-result").length > 3);
  search.value = "없는단어999";
  search.dispatchEvent(new w.Event("input"));
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.ok(d.getElementById("search-status").textContent.includes("0개"));
  search.value = "";
  search.dispatchEvent(new w.Event("input"));
  assert.equal(d.getElementById("library-groups").hidden, false);
  const toggle = d.querySelector(".sidebar-toggle");
  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  dom.window.close();
});

test("learning interactions and every dynamic source link remain valid after migration", () => {
  const dom = new JSDOM(read("index.html"), {
    url: "https://test.invalid/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window,
    d = w.document;
  w.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new w.Event("close"));
  };
  w.eval(read("assets/app.js"));
  for (const button of d.querySelectorAll("[data-actor]")) {
    button.click();
    assert.equal(button.getAttribute("aria-pressed"), "true");
    assert.ok(d.querySelector(".actor-panel h3"));
  }
  for (const button of d.querySelectorAll("[data-issue]")) {
    button.click();
    assert.equal(button.getAttribute("aria-pressed"), "true");
  }
  for (const button of d.querySelectorAll("[data-source]")) {
    button.click();
    assert.ok(d.getElementById("source-dialog").open);
    for (const a of d.querySelectorAll(".source-items a")) {
      const href = a.getAttribute("href");
      if (!href.startsWith("http"))
        assert.ok(
          fs.existsSync(path.join(publicRoot, decodeURIComponent(href))),
          href,
        );
    }
    d.querySelector("#source-dialog .dialog-close").click();
  }
  d.querySelector(".glossary-open").click();
  const search = d.getElementById("glossary-search");
  search.value = "COREPER";
  search.dispatchEvent(new w.Event("input"));
  assert.match(d.getElementById("glossary-list").textContent, /상주대표/);
  d.querySelector("#glossary-dialog .dialog-close").click();
  for (const id of ["council-range", "parliament-range"]) {
    const input = d.getElementById(id);
    input.value = 18;
    input.dispatchEvent(new w.Event("input"));
  }
  assert.ok(d.getElementById("lab-result").classList.contains("no-overlap"));
  d.getElementById("reset-lab").click();
  assert.ok(!d.getElementById("lab-result").classList.contains("no-overlap"));
  [1, 2, 0, 1, 2].forEach((answer, index) =>
    d.querySelector(`[data-quiz="${index}"][data-answer="${answer}"]`).click(),
  );
  assert.match(d.getElementById("quiz-summary").textContent, /5\/5/);
  d.getElementById("quiz-reset").click();
  assert.equal(d.getElementById("quiz-count").textContent, "0 / 5 완료");
  dom.window.close();
});

test("mermaid diagrams have a local bundle and readable fallback", () => {
  const page = read("F/02_슬라이드_구성과_시간배분.html");
  assert.match(page, /class="mermaid"/);
  assert.match(page, /src="\/assets\/diagrams.js"/);
  assert.ok(
    fs.statSync(path.join(publicRoot, "assets/diagrams.js")).size > 1000,
  );
});

test("Kustomize public/private variants point to gh and serve generated public only", () => {
  for (const variant of ["deploy", "deploy/private"]) {
    const output = execFileSync("kubectl", ["kustomize", variant], {
      cwd: root,
      encoding: "utf8",
    });
    const objects = parseAllDocuments(output).map((doc) => doc.toJSON());
    const deployment = objects.find((o) => o.kind === "Deployment");
    assert.equal(deployment.metadata.name, "eu-ai-act");
    assert.equal(deployment.metadata.namespace, "app");
    const sync = deployment.spec.template.spec.containers.find(
      (c) => c.name === "git-sync",
    );
    assert.ok(
      sync.args.includes("--repo=https://github.com/ggingggang/gh.git"),
    );
    const nginx = deployment.spec.template.spec.containers.find(
      (c) => c.name === "nginx",
    );
    assert.equal(nginx.readinessProbe.httpGet.path, "/index.html");
    assert.equal(nginx.livenessProbe.httpGet.path, "/healthz");
    assert.equal(nginx.securityContext.readOnlyRootFilesystem, true);
    const config = objects.find((o) => o.kind === "ConfigMap");
    assert.match(config.data["default.conf"], /root \/git\/current\/public;/);
    assert.match(config.data["default.conf"], /try_files \$uri \$uri\/ =404/);
    assert.equal(
      deployment.spec.template.spec.volumes.find((v) => v.name === "nginx-conf")
        .configMap.name,
      config.metadata.name,
    );
    const route = objects.find((o) => o.kind === "HTTPRoute");
    assert.deepEqual(route.spec.hostnames, ["gh.ggang.cloud"]);
    assert.equal(route.spec.rules[0].backendRefs[0].name, "eu-ai-act");
    if (variant.includes("private"))
      assert.ok(sync.env.some((e) => e.name === "GITSYNC_PASSWORD_FILE"));
    assert.ok(!objects.some((o) => o.kind === "Secret"));
  }
});

test("HTTP preview serves Korean document routes and excludes original and deployment paths", async () => {
  const child = spawn(process.execPath, ["scripts/preview.mjs"], {
    cwd: root,
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    const [chunk] = await Promise.race([
      once(child.stdout, "data"),
      new Promise((_, reject) => {
        const timer = setTimeout(
          () => reject(Error("Preview startup timeout")),
          10000,
        );
        timer.unref();
      }),
    ]);
    const base = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/)[0];
    const routes = [
      "/",
      "/docs/",
      "/A/",
      "/B/",
      "/C/",
      "/D/",
      "/F/",
      "/sources/",
      "/docs/search-index.json",
      "/assets/docs.js",
      ...info.documents.map((d) => d.url),
    ];
    for (const route of routes) {
      const response = await fetch(base + encodeURI(route));
      assert.equal(response.status, 200, route);
      await response.arrayBuffer();
    }
    for (const route of [
      "/A/README.md",
      "/deploy/base/deployment.yaml",
      "/.git/config",
      "/B/removed.pdf",
      "/missing-page",
    ]) {
      const response = await fetch(base + route);
      assert.equal(response.status, 404, route);
      await response.arrayBuffer();
    }
  } finally {
    const exited = once(child, "exit");
    child.kill();
    await exited;
  }
});
