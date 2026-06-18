// DATA - 18 IMAGES FROM UNSPLASH (FREE TO USE)
const PHOTOS = [
  // NATURE (6)
  { id: 1,  title: "Morning Canopy",   category: "nature",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop" },
  { id: 2,  title: "Macro Leaf",       category: "nature",
    url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&auto=format&fit=crop" },
  { id: 3,  title: "River Fog",        category: "nature",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&auto=format&fit=crop" },
  { id: 4,  title: "Rocky Shore",      category: "nature",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&auto=format&fit=crop" },
  { id: 5,  title: "Snow Peak",        category: "nature",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop" },
  { id: 6,  title: "Desert Dunes",     category: "nature",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&auto=format&fit=crop" },


  // TECH (6)
  { id: 7,  title: "Circuit Board",    category: "tech",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop" },
  { id: 8,  title: "Data Center",      category: "tech",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop" },
  { id: 9, title: "Code Terminal",    category: "tech",
    url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&auto=format&fit=crop" },
  { id: 10, title: "Server Room",      category: "tech",
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&auto=format&fit=crop" },
  { id: 11, title: "Drone View",       category: "tech",
    url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&auto=format&fit=crop" },
  { id: 12, title: "VR Headset",       category: "tech",
    url: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=900&auto=format&fit=crop" },

  // ABSTRACT (6)
  { id: 13, title: "Light Trails",     category: "abstract",
    url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&auto=format&fit=crop" },
  { id: 14, title: "Liquid Forms",     category: "abstract",
    url: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=900&auto=format&fit=crop" },
  { id: 15, title: "Neon Geometry",    category: "abstract",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop" },
  { id: 16, title: "Smoke Plume",      category: "abstract",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop" },
  { id: 17, title: "Bokeh Bloom",      category: "abstract",
    url: "https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=900&auto=format&fit=crop" },
  { id: 18, title: "Prism Split",      category: "abstract",
    url: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=900&auto=format&fit=crop" },
];

// STATE - VARIABLES THAT TRACKS WHAT'S HAPPENING
let activeFilter   = "all";        // which category button is active
let activeLightbox = -1;           // which photo index is open (-1 = none)
let visiblePhotos  = [...PHOTOS];  // filtered subset currently shown


// RENDER GALLERY - CLEARS THE GRIDE AND REBUILDS ALL CARDS FROM VISIBLEPHOTOS
const gallery    = document.getElementById("gallery");
const countLabel = document.getElementById("count-label");

function renderGallery() {
    // 1. Filter the photos array
  visiblePhotos = activeFilter === "all"
    ? PHOTOS
    : PHOTOS.filter(p => p.category === activeFilter);

  // 2. Update the count label
  countLabel.textContent = `${visiblePhotos.length} photo${visiblePhotos.length !== 1 ? "s" : ""}`;

  // 3. Clear existing cards
  gallery.innerHTML = "";

  // 4. Build a card element for each photo
  visiblePhotos.forEach((photo, idx) => {
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open ${photo.title}`);
    card.dataset.index = idx;

    // Capitalize category name for the chip label
    const chipClass = `chip chip-${photo.category}`;
    const chipLabel = photo.category.charAt(0).toUpperCase() + photo.category.slice(1);

    card.innerHTML = `
      <img src="${photo.url}" alt="${photo.title}" loading="lazy" />
      <div class="card-overlay">
        <div class="card-title">${photo.title}</div>
        <div class="card-meta">
          <span class="${chipClass}">${chipLabel}</span>
        </div>
      </div>
    `;

    // Click opens lightbox
    card.addEventListener("click", () => openLightbox(idx));

    // Keyboard: Enter or Space also opens lightbox
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });

    gallery.appendChild(card);
  });
}

// FILTER BUTTONS (WHEN CLICKED, UPDATE STATE AND RE-RENDER THE GALLERY)
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active from all buttons
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    // Set clicked button as active
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    activeFilter = btn.dataset.cat;
    renderGallery();
  });
});

// LIGHTBOX
const lightbox  = document.getElementById("lightbox");
const lbImage   = document.getElementById("lb-image");
const lbTitle   = document.getElementById("lb-title");
const lbCounter = document.getElementById("lb-counter");

// Open lightbox at a given index
function openLightbox(idx) {
  activeLightbox = idx;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden"; // prevent background scroll
  document.getElementById("lb-close").focus();
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  activeLightbox = -1;
}

// Update image, title, counter for current index
function updateLightbox() {
  const photo = visiblePhotos[activeLightbox];

  // Fade out → swap src → fade in
  lbImage.classList.add("switching");
  setTimeout(() => {
    lbImage.src = photo.url;
    lbImage.alt = photo.title;
    lbImage.classList.remove("switching");
  }, 200);

  lbTitle.textContent   = photo.title;
  lbCounter.textContent = `${activeLightbox + 1} / ${visiblePhotos.length}`;
}

// Go to previous photo (wraps around)
function prevPhoto() {
  activeLightbox = (activeLightbox - 1 + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

// Go to next photo (wraps around)
function nextPhoto() {
  activeLightbox = (activeLightbox + 1) % visiblePhotos.length;
  updateLightbox();
}

// Button listeners
document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", prevPhoto);
document.getElementById("lb-next").addEventListener("click", nextPhoto);

// Close when clicking outside the image (on the dark backdrop)
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation inside lightbox
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowLeft")  prevPhoto();
  if (e.key === "ArrowRight") nextPhoto();
  if (e.key === "Escape")     closeLightbox();
});

// INIT - RUN ON PAGE LOAD
renderGallery();