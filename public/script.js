// ========================
// Variables Globales
// ========================
let allProjectsData = [];
const API_BASE = "https://portfolio-backend-cj5g.onrender.com";

// ========================
// Loader inicial
// ========================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = 0;
    setTimeout(() => loader.remove(), 600);
  }
});

// ========================
// Carga de proyectos en Home
// ========================
fetch(`${API_BASE}/api/projects`)
  .then(res => res.json())
  .then(projects => {
    allProjectsData = projects;

    const container = document.getElementById("projectCardsContainer");
    if (!container) {
      console.error("No existe #projectCardsContainer en el HTML");
      return;
    }

    container.innerHTML = "";

    projects.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "cards";

      const mediaHTML = project.gallery
        .slice(0, 3)
        .map((item, i) => {
          const className = `img-${String.fromCharCode(97 + i)}`;
          const isVideo = item.match(/\.(mp4|webm|ogg)(\?|$)/i);
          return isVideo
            ? `<div class="${className}"><video src="${item}" autoplay muted loop playsinline></video></div>`
            : `<div class="${className}"><img src="${item}" alt="Image ${i + 1}" /></div>`;
        })
        .join("");

      card.innerHTML = `
        <p>0${index + 1} / ${project.category || "Project"}</p>
        <div class="title">
          <h3>${project.title}</h3>
          <i class="i" data-lucide="external-link"></i>
        </div>
        <p>${project.description}</p>
        <div class="img-grid">${mediaHTML}</div>
      `;

      card.addEventListener("click", () => {
        openProjectFromData(project, allProjectsData);
      });

      container.appendChild(card);
    });

    lucide.createIcons();
  })
  .catch(err => {
    console.error("Error al cargar proyectos:", err);
  });

// ========================
// Sincronización de scroll entre .content y .projects
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const leftPanel = document.querySelector(".hero .content");
  const rightPanel = document.querySelector(".hero .projects");

  if (leftPanel && rightPanel && window.innerWidth >= 768) {
    leftPanel.addEventListener("scroll", () => {
      rightPanel.scrollTop = leftPanel.scrollTop;
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".hero .content");
  const projects = document.querySelector(".hero .projects");

  function setupScrollSync() {
    if (window.innerWidth >= 768 && content && projects) {
      content.addEventListener("wheel", onWheelScroll, { passive: false });
    }
  }

  function removeScrollSync() {
    content.removeEventListener("wheel", onWheelScroll);
  }

  function onWheelScroll(e) {
    e.preventDefault();
    projects.scrollTop += e.deltaY;
  }

  setupScrollSync();

  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      removeScrollSync();
    } else {
      setupScrollSync();
    }
  });
});

// ========================
// Botón de scroll a proyectos
// ========================
document.getElementById("scrollToProjects")?.addEventListener("click", () => {
  document.querySelector(".hero .projects")?.scrollTo({ top: 0, behavior: "smooth" });
});