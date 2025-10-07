/* Minimal JS: lazyload fallback + lightbox za sve stranice */

(function () {
  // ==== Lazyload fallback (ako browser ne podržava loading=lazy) ====
  if (!("loading" in HTMLImageElement.prototype)) {
    document.querySelectorAll("img[loading='lazy']").forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        const pre = new Image();
        pre.src = src;
        pre.onload = () => (img.src = src);
      }
    });
  }

  // ==== LIGHTBOX ====
  const root = document.getElementById("lightbox-root");
  if (!root) return;

  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;padding:24px;z-index:9999;";
  const imgEl = document.createElement("img");
  imgEl.alt = "";
  imgEl.style.cssText =
    "max-width:95vw;max-height:90vh;object-fit:contain;box-shadow:0 8px 32px rgba(0,0,0,.6);border-radius:12px;";
  overlay.appendChild(imgEl);

  function show(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || "";
    root.innerHTML = "";
    root.appendChild(overlay);
    root.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function hide() {
    root.hidden = true;
    document.body.style.overflow = "";
    imgEl.src = "";
  }

  overlay.addEventListener("click", hide);
  window.addEventListener("keydown", (e) => e.key === "Escape" && hide());

  // delegacija: klik na bilo koju sliku u .grid => lightbox
  document.addEventListener("click", (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    const inCard = img.closest(".grid .img-wrap, .img-wrap");
    if (!inCard) return;
    if (e.target.closest(".links")) return; // ne hvataj klik na dugmad/linkove
    e.preventDefault();
    show(img.currentSrc || img.src, img.alt);
  });
})();
// spoji svaka 2 sibling <article.card> u jedan .pair red
function pairCards(gridSelector = ".grid.pair-2") {
  document.querySelectorAll(gridSelector).forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(":scope > article.card"));
    if (cards.length === 0) return;

    // skloni postojeće kartice iz grida
    cards.forEach((c) => c.remove());

    // ubaci ih po dve u .pair kontejnere
    for (let i = 0; i < cards.length; i += 2) {
      const row = document.createElement("div");
      row.className = "pair";
      row.appendChild(cards[i]);
      if (cards[i + 1]) row.appendChild(cards[i + 1]); // drugi u paru ako postoji
      grid.appendChild(row);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  pairCards(); // pokreni za sve .grid.pair-2
});
