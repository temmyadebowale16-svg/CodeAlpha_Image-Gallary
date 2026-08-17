/* ============================================================
   Plates — A Photographic Catalog
   Gallery rendering, category filtering, lightbox navigation
   ============================================================ */

const PLATES = [
  { id: 1,  title: "images (1)",        category: "download",       year: "2024", src: "CodeAlpha_ImageGallary/images (1).jpg" },
  { id: 2,  title: "104g1d6id",        category: "image", year: "2023", src: "CodeAlpha_ImageGallary/104g1d6idrg2f84r30mw169935e730c0b5.png" },
  { id: 3,  title: "0000000dc98",    category: "camera",       year: "2022", src: "CodeAlpha_ImageGallary/file_00000000dc98620a9c65560dd4fd97ef.png" },
  { id: 4,  title: "00000000067",        category: "download",     year: "2024", src: "CodeAlpha_ImageGallary/file_00000000674c71f4a1d1568c923fba93.png" },
  { id: 5,  title: "images (2)",      category: "image",       year: "2021", src: "CodeAlpha_ImageGallary/images (2).jpg" },
  { id: 6,  title: "images (3)",     category: "image", year: "2023", src: "CodeAlpha_ImageGallary/images (3).jpg" },
  { id: 7,  title: "images (4)",       category: "camera",       year: "2020", src: "CodeAlpha_ImageGallary/images (4).jpg" },
  { id: 8,  title: "images (5)",     category: "download",     year: "2024", src: "CodeAlpha_ImageGallary/images (5).jpg" },
  { id: 9,  title: "images (6)",           category: "camera",       year: "2022", src: "CodeAlpha_ImageGallary/images (6).jpg" },
  { id: 10, title: "images (7)",    category: "image", year: "2021", src: "CodeAlpha_ImageGallary/images (7).jpg" },
  { id: 11, title: "images",       category: "download",       year: "2023", src: "CodeAlpha_ImageGallary/images.jpg" },
  { id: 12, title: "IMG-20251105",        category: "camera",       year: "2020", src: "CodeAlpha_ImageGallary/IMG-20251105-WA0012.jpg" },
{ id: 13, title: "shopping",        category: "camera",       year: "2020", src: "CodeAlpha_ImageGallary/shopping.webp" },
];

const galleryEl   = document.getElementById("gallery");
const filterBtns  = document.querySelectorAll(".filter-chip");
const lightbox    = document.getElementById("lightbox");
const lbImg       = document.getElementById("lb-img");
const lbPlate     = document.getElementById("lb-plate");
const lbTitle     = document.getElementById("lb-title");
const lbMeta      = document.getElementById("lb-meta");
const lbIndex     = document.getElementById("lb-index");
const lbClose     = document.getElementById("lb-close");
const lbPrev      = document.getElementById("lb-prev");
const lbNext      = document.getElementById("lb-next");

let activeFilter = "all";
let visiblePlates = [...PLATES];
let currentIndex = 0;

function plateNumber(id){
  return "PLATE №" + String(id).padStart(3, "0");
}

function renderGallery(){
  galleryEl.innerHTML = "";
  PLATES.forEach((plate, i) => {
    const fig = document.createElement("figure");
    fig.className = "plate";
    fig.dataset.category = plate.category;
    fig.dataset.id = plate.id;
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", `Open ${plate.title} in lightbox`);
    fig.style.animationDelay = (i * 0.04) + "s";

    fig.innerHTML = `
      <img src="${plate.src}" alt="${plate.title}, ${plate.category} photograph" loading="lazy" />
      <figcaption class="plate-overlay">
        <span class="plate-num">${plateNumber(plate.id)}</span>
        <h2 class="plate-title">${plate.title}</h2>
        <span class="plate-cat">${plate.category} — ${plate.year}</span>
      </figcaption>
    `;

    fig.addEventListener("click", () => openLightbox(plate.id));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(plate.id);
      }
    });

    galleryEl.appendChild(fig);
  });

  document.getElementById("count-all").textContent = "(" + PLATES.length + ")";
  applyFilter(activeFilter);
}

function applyFilter(category){
  activeFilter = category;

  filterBtns.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === category);
  });

  const plates = document.querySelectorAll(".plate");
  plates.forEach(el => {
    const match = category === "all" || el.dataset.category === category;
    el.classList.toggle("is-hidden", !match);
  });

  visiblePlates = category === "all"
    ? [...PLATES]
    : PLATES.filter(p => p.category === category);
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

/* ---------- Lightbox ---------- */

function openLightbox(id){
  currentIndex = visiblePlates.findIndex(p => p.id === id);
  if (currentIndex === -1) currentIndex = 0;
  showPlate(currentIndex);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showPlate(index){
  const plate = visiblePlates[index];
  if (!plate) return;

  lbImg.classList.remove("is-visible");

  const nextImg = new Image();
  nextImg.onload = () => {
    lbImg.src = plate.src;
    requestAnimationFrame(() => lbImg.classList.add("is-visible"));
  };
  nextImg.src = plate.src;

  lbPlate.textContent = plateNumber(plate.id);
  lbTitle.textContent = plate.title;
  lbMeta.textContent = plate.category + " — " + plate.year;
  lbIndex.textContent = (index + 1) + " / " + visiblePlates.length;
}

function showNext(){
  currentIndex = (currentIndex + 1) % visiblePlates.length;
  showPlate(currentIndex);
}

function showPrev(){
  currentIndex = (currentIndex - 1 + visiblePlates.length) % visiblePlates.length;
  showPlate(currentIndex);
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

/* Basic swipe support for touch devices */
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
lightbox.addEventListener("touchend", (e) => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 50) {
    delta > 0 ? showPrev() : showNext();
  }
});

renderGallery();
