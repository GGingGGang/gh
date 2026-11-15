"use strict";
const toggle = document.querySelector(".sidebar-toggle");
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("sidebar-open", open);
});
document
  .querySelector(".print-doc")
  ?.addEventListener("click", () => window.print());
const search = document.getElementById("document-search");
let loadedIndex;
let request = 0;
if (search)
  search.addEventListener("input", async () => {
    const thisRequest = ++request;
    const query = search.value.trim();
    const groups = document.getElementById("library-groups");
    const results = document.getElementById("search-results");
    const status = document.getElementById("search-status");
    if (!query) {
      groups.hidden = false;
      results.hidden = true;
      status.textContent = `${status.dataset.total}개의 분석·개요 문서`;
      return;
    }
    try {
      loadedIndex ||= fetch("/docs/search-index.json").then((response) => {
        if (!response.ok) throw Error("index unavailable");
        return response.json();
      });
      const index = await loadedIndex;
      if (thisRequest !== request) return;
      const words = query.toLocaleLowerCase().split(/\s+/);
      const matches = index.filter((doc) =>
        words.every((word) =>
          (doc.title + " " + doc.group + " " + doc.text)
            .toLocaleLowerCase()
            .includes(word),
        ),
      );
      groups.hidden = true;
      results.hidden = false;
      results.replaceChildren();
      status.textContent = `검색 결과 ${matches.length}개`;
      for (const doc of matches) {
        const link = document.createElement("a");
        link.className = "search-result";
        link.href = doc.url;
        const label = document.createElement("span");
        label.textContent = doc.group + " / 분석 문서";
        const title = document.createElement("h2");
        title.textContent = doc.title;
        const snippet = document.createElement("p");
        const pos = doc.text.toLocaleLowerCase().indexOf(words[0]);
        const start = Math.max(0, pos - 45);
        snippet.textContent =
          (start ? "…" : "") + doc.text.slice(start, start + 180) + "…";
        link.append(label, title, snippet);
        results.append(link);
      }
      if (!matches.length) {
        const note = document.createElement("p");
        note.className = "reader-note";
        note.textContent =
          "일치하는 문서가 없습니다. 더 짧은 단어나 다른 용어로 찾아보세요.";
        results.append(note);
      }
    } catch {
      loadedIndex = undefined;
      status.textContent =
        "검색 자료를 불러오지 못했습니다. 아래 분야별 목록을 이용해 주세요.";
      groups.hidden = false;
      results.hidden = true;
    }
  });
