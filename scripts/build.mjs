import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import GithubSlugger from "github-slugger";
import { build } from "esbuild";

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const GROUPS = [
  {
    id: "A",
    title: "입법 배경과 필요성",
    description: "AI Act의 목적, 규율 구조와 입법의 출발점",
  },
  {
    id: "B",
    title: "외부 이해관계와 협상 요구",
    description: "행위자별 요구, 전달 경로, 최초 요구와 타협 비교",
  },
  {
    id: "C",
    title: "내부 조율과 검증",
    description: "정부·회원국·의회의 조율과 방법론에 대한 비판 검토",
  },
  {
    id: "D",
    title: "협상 결과와 종합 결론",
    description: "교섭·내부 위임·승인을 연결한 양면게임 해석",
  },
  {
    id: "F",
    title: "발표 구성안",
    description: "20분 발표 개요와 슬라이드별 시간 배분",
  },
];
const OUTPUT = path.join(ROOT, "public");
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (value) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        value
      ],
  );
const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
const catalog = [];

for (const group of GROUPS) {
  for (const entry of fs
    .readdirSync(path.join(ROOT, group.id), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "ko"))) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const source = `${group.id}/${entry.name}`;
    const content = fs
      .readFileSync(path.join(ROOT, source), "utf8")
      .replace(/^\uFEFF/, "")
      .replace(/\r\n?/g, "\n");
    const tokens = md.parse(content, {});
    const slugger = new GithubSlugger();
    const headings = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "heading_open") continue;
      const text =
        tokens[i + 1].children
          ?.filter((t) => t.type === "text" || t.type === "code_inline")
          .map((t) => t.content)
          .join("") || tokens[i + 1].content;
      const id = slugger.slug(text);
      tokens[i].attrSet("id", id);
      headings.push({ text, id, level: Number(tokens[i].tag.slice(1)) });
    }
    catalog.push({
      group: group.id,
      source,
      name: entry.name,
      title: headings.find((h) => h.level === 1)?.text || entry.name,
      url: `/${source.replace(/\.md$/, ".html")}`,
      content,
      tokens,
      headings,
    });
  }
}
const bySource = new Map(catalog.map((doc) => [doc.source, doc]));
const excluded = [];

function resolveLink(href, doc) {
  if (/^https?:\/\//i.test(href)) return { href, external: true };
  if (/^mailto:/i.test(href)) return { href };
  if (href.startsWith("#")) {
    const fragment = decodeURIComponent(href.slice(1));
    return {
      href: doc.headings.some((h) => h.id === fragment)
        ? href
        : "#" + (doc.headings[0]?.id || ""),
    };
  }
  let parsed;
  try {
    parsed = new URL(href, `https://local.invalid/${doc.source}`);
  } catch {
    return { excluded: true };
  }
  if (parsed.origin !== "https://local.invalid") return { excluded: true };
  const candidate = decodeURIComponent(parsed.pathname).slice(1);
  const target = bySource.get(candidate);
  if (!target) {
    excluded.push({ document: doc.source, target: candidate });
    return { excluded: true };
  }
  const fragment = decodeURIComponent(parsed.hash.slice(1));
  return {
    href:
      target.url +
      (target.headings.some((h) => h.id === fragment) ? parsed.hash : ""),
  };
}
md.renderer.rules.link_open = (tokens, index, options, env) => {
  const result = resolveLink(tokens[index].attrGet("href"), env.doc);
  if (result.excluded) {
    tokens[index].meta = { excluded: true };
    return '<span class="excluded-reference" title="원문·검증용 파일은 배포하지 않습니다">';
  }
  return `<a href="${escape(result.href)}"${result.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
};
md.renderer.rules.link_close = (tokens, index) => {
  for (let i = index - 1; i >= 0; i--)
    if (tokens[i].type === "link_open")
      return tokens[i].meta?.excluded
        ? " <small>파일 미포함</small></span>"
        : "</a>";
  return "</a>";
};
md.renderer.rules.image = (tokens, index) =>
  `<span class="excluded-reference">${escape(tokens[index].content || "자료 이미지")} <small>원문 이미지 미포함</small></span>`;
const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens, index, options, env, self) => {
  if (tokens[index].info.trim() === "mermaid")
    return `<figure class="diagram"><pre class="mermaid">${escape(tokens[index].content)}</pre><figcaption>구조도 · 원문 정의에 따른 관계</figcaption></figure>`;
  return defaultFence(tokens, index, options, env, self);
};

function sidebar(current) {
  return `<aside class="doc-sidebar" id="doc-sidebar"><a class="sidebar-home" href="/docs/">전체 문서 <span>${catalog.length}</span></a>${GROUPS.map(
    (group) =>
      `<details${current?.group === group.id ? " open" : ""}><summary><span>${group.id}</span>${group.title}</summary><a class="group-overview" href="/${group.id}/">분야 안내 ↗</a>${catalog
        .filter((doc) => doc.group === group.id)
        .map(
          (doc) =>
            `<a href="${escape(doc.url)}"${doc.source === current?.source ? ' class="current" aria-current="page"' : ""}>${escape(doc.name === "README.md" ? "자료 안내" : doc.title)}</a>`,
        )
        .join("")}</details>`,
  ).join("")}<a class="sidebar-back" href="/">← 스크롤 학습으로</a></aside>`;
}
function shell({
  title,
  body,
  doc,
  toc = "",
  search = false,
  diagrams = false,
}) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="EU AI Act 조원 분석자료와 학습 문서"><title>${escape(title)} · EU AI Act</title><link rel="stylesheet" href="/assets/docs.css"><script src="/assets/docs.js" defer></script>${diagrams ? '<script src="/assets/diagrams.js" defer></script>' : ""}</head><body class="docs-body"><a class="skip-link" href="#doc-content">본문으로</a><header class="doc-header"><a href="/" class="doc-brand">✳ <span>협상을 읽다<small>EU AI ACT</small></span></a><nav aria-label="사이트"><a href="/">스크롤 학습</a><a href="/docs/" aria-current="page">문서실</a></nav><button class="sidebar-toggle" aria-expanded="false" aria-controls="doc-sidebar">문서 목록</button></header><div class="docs-layout">${sidebar(doc)}<main class="doc-main" id="doc-content">${body}</main>${toc ? `<aside class="doc-toc"><span>이 문서에서</span>${toc}</aside>` : ""}</div><footer class="doc-footer"><span>분석자료 A · B · C · D · F</span><a href="/sources/">자료 포함 범위</a><button class="print-doc">인쇄 / PDF</button></footer></body></html>`;
}
function write(relative, content) {
  const target = path.join(OUTPUT, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

// Only this explicitly marked generated directory can be cleared.
if (
  path.resolve(OUTPUT) !== path.resolve(ROOT, "public") ||
  path.dirname(OUTPUT) !== ROOT
)
  throw Error("Unexpected output path");
if (fs.existsSync(OUTPUT)) {
  if (
    fs.lstatSync(OUTPUT).isSymbolicLink() ||
    !fs.existsSync(path.join(OUTPUT, ".generated"))
  )
    throw Error("Refusing to replace unmarked public directory");
  fs.rmSync(OUTPUT, { recursive: true });
}
fs.mkdirSync(OUTPUT, { recursive: true });
write(
  ".generated",
  "Generated by scripts/build.mjs. Do not edit public directly.\n",
);
for (const asset of ["styles.css", "docs.css", "docs.js"])
  write(`assets/${asset}`, fs.readFileSync(path.join(ROOT, "site", asset)));
let story = fs.readFileSync(path.join(ROOT, "site/index.html"), "utf8");
story = story
  .replace('href="styles.css"', 'href="/assets/styles.css"')
  .replace('src="app.js"', 'src="/assets/app.js"');
story = story.replace(
  '<nav class="chapter-nav"',
  '<a class="library-link" href="/docs/">문서실 A–F ↗</a>\n<nav class="chapter-nav"',
);
story = story.replace(
  "A~D의 검증 자료를 바탕으로 재구성했습니다.",
  'A~D의 분석 자료를 바탕으로 재구성했습니다. <a href="/docs/" class="text-button">문서실에서 A·B·C·D·F 전체 읽기 ↗</a>',
);
write("index.html", story);
let app = fs.readFileSync(path.join(ROOT, "site/app.js"), "utf8");
for (const doc of catalog) app = app.split(`../../${doc.source}`).join(doc.url);
const originalReplacements = [
  [
    "../../B/원문/S19_1988_Putnam_대조본.pdf",
    "https://doi.org/10.1017/S0020818300027697",
  ],
  [
    "../../C/검증자료/N02_20240522_이사회_표결_ST10199.pdf",
    "https://data.consilium.europa.eu/doc/document/ST-10199-2024-INIT/en/pdf",
  ],
  [
    "../../B/원문/S02_202311_프독이_Nonpaper.pdf",
    "https://cdn.table.media/assets/wp-content/uploads/2023/11/20231118_Non-Paper-on-FM_GPAI-DE-F-IT.pdf",
  ],
  ["Putnam 원문 로컬 대조본", "Putnam 원논문 서지"],
  [
    "외부 원문은 인터넷 연결이 필요합니다. A~F 로컬 문서는 원래 폴더 구조를 유지하면 열 수 있습니다.",
    "A~F 문서는 이 사이트에서 읽을 수 있습니다. 1차 자료 파일은 배포하지 않으며, 외부 원문 링크는 원래 제공 사이트로 연결됩니다.",
  ],
];
for (const [from, to] of originalReplacements) app = app.split(from).join(to);
if (app.includes("../../")) throw Error("Unmapped story source path");
write("assets/app.js", app);

for (const doc of catalog) {
  const group = GROUPS.find((g) => g.id === doc.group);
  const rendered = md.renderer.render(doc.tokens, md.options, { doc });
  const content = `<div class="doc-breadcrumb"><a href="/docs/">문서실</a><span>/</span><a href="/${group.id}/">${group.id} ${group.title}</a></div><div class="doc-meta"><span>${doc.name === "README.md" ? "자료 안내" : "분석 문서"}</span><span>원문 파일 제외 · 외부 출처 링크 유지</span></div><article class="markdown-body">${rendered}</article><div class="doc-end"><a href="/${group.id}/">← ${group.id} 분야 문서</a><a href="/docs/">전체 문서 보기 →</a></div>`;
  const toc = doc.headings
    .filter((h) => h.level === 2 || h.level === 3)
    .map(
      (h) =>
        `<a href="#${escape(h.id)}" class="level-${h.level}">${escape(h.text)}</a>`,
    )
    .join("");
  write(
    doc.url.slice(1),
    shell({
      title: doc.title,
      body: content,
      doc,
      toc,
      diagrams: doc.content.includes("```mermaid"),
    }),
  );
}

function card(doc) {
  return `<a class="document-card" href="${escape(doc.url)}"><span>${doc.group} / ${escape(doc.name === "README.md" ? "안내" : doc.name.replace(".md", ""))}</span><h3>${escape(doc.title)}</h3><p>${escape(
    doc.content
      .replace(/^#+.*$/gm, "")
      .replace(/\[[^\]]+\]\([^)]*\)/g, "")
      .replace(/[>*`|\n]/g, " ")
      .trim()
      .slice(0, 105),
  )}…</p><b>읽기 ↗</b></a>`;
}
for (const group of GROUPS) {
  const docs = catalog.filter((doc) => doc.group === group.id);
  const body = `<div class="doc-breadcrumb"><a href="/docs/">문서실</a><span>/ ${group.id}</span></div><div class="collection-title"><span>${group.id} · ${docs.length} DOCUMENTS</span><h1>${group.title}</h1><p>${group.description}</p></div>${group.id === "F" ? '<p class="reader-note">F는 자료를 정리할 때 지정한 폴더명입니다. 내용은 발표 개요와 시간 배분이므로 화면에서는 ‘발표 구성안’으로 안내합니다.</p>' : ""}<div class="document-grid">${docs.map(card).join("")}</div>`;
  write(
    `${group.id}/index.html`,
    shell({ title: group.title, body, doc: { group: group.id } }),
  );
}
const library = `<div class="collection-title"><span>READ THE DOCUMENTS / ${catalog.length} NOTES</span><h1>자료를 연결해서 읽기.</h1><p>학습 페이지에서 큰 흐름을 잡았다면, 각 분야의 근거·검증·비판을 함께 읽어보세요.</p></div><label class="document-search-label" for="document-search">문서 제목과 본문 검색</label><div class="document-search-wrap"><input id="document-search" type="search" placeholder="예: 윈셋, Aleph Alpha, 승인…" autocomplete="off"><span aria-hidden="true">⌕</span></div><p id="search-status" role="status" data-total="${catalog.length}">${catalog.length}개의 분석·개요 문서</p><div id="search-results" class="search-results" hidden></div><div id="library-groups">${GROUPS.map(
  (group) =>
    `<section class="library-group"><div><a href="/${group.id}/"><span>${group.id}</span><h2>${group.title}</h2></a><p>${group.description}</p></div><div class="document-grid">${catalog
      .filter((doc) => doc.group === group.id)
      .map(card)
      .join("")}</div></section>`,
).join("")}</div>`;
write(
  "docs/index.html",
  shell({ title: "문서실", body: library, search: true }),
);
write(
  "docs/search-index.json",
  JSON.stringify(
    catalog.map((doc) => ({
      title: doc.title,
      group: doc.group,
      url: doc.url,
      text: doc.content
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[\n#*`>|]/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    })),
  ),
);
write(
  "sources/index.html",
  shell({
    title: "자료 포함 범위",
    body: `<div class="collection-title"><span>ABOUT THE MATERIALS</span><h1>분석 문서는 읽고,<br>원문은 출처에서.</h1><p>A·B·C·D·F의 최상위 Markdown ${catalog.length}개와 학습 페이지만 포함합니다.</p></div><article class="markdown-body"><h2>포함한 내용</h2><p>입법 배경, 이해관계 분석, 내부 조율 검토, 종합 결론, 비판 검토, 발표 구성안입니다. C의 독립 비판 검토도 분석상의 한계를 살펴볼 수 있도록 함께 제공합니다.</p><h2>포함하지 않은 파일</h2><p>1차 자료 PDF·보관 HTML·발췌 TXT, 원문·검증자료·검증 폴더, 스크린샷, 수집 기록, Graphify 데이터는 이 배포에 넣지 않았습니다.</p><p>문서의 제외 대상 로컬 링크는 <span class="excluded-reference">출처명 <small>파일 미포함</small></span>으로 표시합니다. 원래 공개된 공식 웹사이트의 링크는 유지하며, 원문을 이 사이트에 복제하지 않습니다.</p><h2>F는 무엇인가요?</h2><p>F는 앞서 발표 구성을 저장할 때 지정한 폴더 이름입니다. 화면에서는 ‘발표 구성안’으로 표시하고, 기존 경로와 문서 간 링크를 유지합니다.</p><h2>분석의 시간 범위</h2><p>2023년 협상과 2024년 원법의 승인·채택을 중심으로 합니다. 이후 개정이나 현재 적용 일정과 구분해서 읽어주세요.</p></article><div class="doc-end"><a href="/">스크롤 학습</a><a href="/docs/">문서실 →</a></div>`,
  }),
);
write(
  "404.html",
  shell({
    title: "문서를 찾을 수 없습니다",
    body: '<div class="collection-title"><span>404</span><h1>이 경로에는 문서가 없습니다.</h1><p>1차 원문 파일은 배포하지 않습니다. 문서실에서 분석 자료를 찾아주세요.</p><a href="/docs/">문서실로 이동 →</a></div>',
  }),
);
await build({
  entryPoints: [path.join(ROOT, "site/diagrams.js")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2022",
  outfile: path.join(OUTPUT, "assets/diagrams.js"),
  legalComments: "linked",
});
write(
  "build-info.json",
  JSON.stringify(
    {
      documents: catalog.map(({ source, url, title, group }) => ({
        source,
        url,
        title,
        group,
      })),
      groups: GROUPS,
      excludedLocalReferences: excluded.length,
    },
    null,
    2,
  ),
);
console.log(
  `Built ${catalog.length} documents, 5 collections and the learning site. ${excluded.length} excluded local references labelled; no primary-source files copied.`,
);
