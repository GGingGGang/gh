import mermaid from "mermaid";
mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "neutral",
  fontFamily: "Malgun Gothic, sans-serif",
  suppressErrorRendering: true,
});
mermaid.run({ querySelector: ".mermaid" }).catch(() => {
  document.querySelectorAll(".diagram").forEach((figure) => {
    const note = document.createElement("p");
    note.className = "reader-note";
    note.textContent =
      "구조도를 그리지 못했습니다. 아래 원문 코드로 관계를 확인할 수 있습니다.";
    figure.prepend(note);
  });
});
