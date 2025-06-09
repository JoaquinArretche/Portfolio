// ELEMENTOS PRINCIPALES
const heroBtn = document.getElementById("hero");
const infoBtn = document.getElementById("info");
const projectsBtn = document.getElementById("projectsPanelBtn");

const projectsPanel = document.getElementById("projectsPanel");
const infoPanel = document.getElementById("infoPanel");
const closeInfo = document.getElementById("closeInfo");
const closeProjects = document.getElementById("closeProjects");

const detailPanel = document.getElementById("projectDetailPanel");
const scrollArrow = document.getElementById("scrollDownArrow");
const projectsScrollArea = document.querySelector(".projects");
const detailContainer = document.getElementById("projectDetailContainer");

// BORDE IZQUIERDO DEL PANEL INFO
function updateInfoPanelBorder() {
  if (!infoPanel) return;
  const detailHasPanel = detailContainer?.querySelector(".project-detail-panel");
  const infoIsActive = infoPanel.classList.contains("active");
  infoPanel.style.borderLeft = infoIsActive && detailHasPanel ? "1px solid black" : "none";
}

[infoPanel, detailPanel].forEach(panel => {
  if (panel) {
    const observer = new MutationObserver(updateInfoPanelBorder);
    observer.observe(panel, { attributes: true, attributeFilter: ["class"] });
  }
});

if (detailContainer) {
  const observer = new MutationObserver(updateInfoPanelBorder);
  observer.observe(detailContainer, { childList: true });
}

// TOGGLES
projectsBtn?.addEventListener("click", () => {
  const isActive = projectsPanel?.classList.contains("active");
  projectsPanel?.classList.toggle("active", !isActive);
});

infoBtn?.addEventListener("click", () => {
  const wasActive = infoPanel?.classList.contains("active");
  infoPanel?.classList.toggle("active", !wasActive);
  if (!wasActive) projectsPanel?.classList.remove("active");
});

closeInfo?.addEventListener("click", () => infoPanel?.classList.remove("active"));
closeProjects?.addEventListener("click", () => projectsPanel?.classList.remove("active"));

heroBtn?.addEventListener("click", () => {
  [projectsPanel, infoPanel, detailPanel].forEach(panel => panel?.classList.remove("active"));

  const activePanel = detailContainer?.querySelector(".project-detail-panel");
  if (activePanel) {
    activePanel.classList.add("exiting");
    const btn = document.querySelector(".close-detail-btn");
    if (btn) btn.style.display = "none";
    setTimeout(() => activePanel.remove(), 300);
  }
});

// FLECHA DE SCROLL
function updateScrollArrowVisibility() {
  if (!scrollArrow || !projectsScrollArea) return;
  const scrolled = projectsScrollArea.scrollTop > 10;
  const panelOpen =
    projectsPanel?.classList.contains("active") ||
    infoPanel?.classList.contains("active") ||
    detailPanel?.classList.contains("active");

  scrollArrow.classList.toggle("hidden", scrolled || panelOpen);
}

projectsScrollArea?.addEventListener("scroll", updateScrollArrowVisibility);
[projectsPanel, infoPanel, detailPanel].forEach(panel => {
  if (panel) {
    const observer = new MutationObserver(updateScrollArrowVisibility);
    observer.observe(panel, { attributes: true, attributeFilter: ["class"] });
  }
});

document.getElementById("scrollToProjects")?.addEventListener("click", () => {
  document.querySelector(".hero .projects")?.scrollTo({ top: 0, behavior: "smooth" });
});

// ABRIR DETALLE CON TRANSICION
function openProjectFromData(project, allProjects = [], direction = "next") {
  const container = document.getElementById("projectDetailContainer");
  if (!container) return;

  // Boton de cierre: eliminar anterior y crear nuevo
  const existing = document.querySelector(".close-detail-btn");
  if (existing) existing.remove();

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-detail-btn";
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="20" width="20">
      <path fill="currentColor" d="M 16 27.95 C 22.54 27.95 27.95 22.53 27.95 16 S 22.54 4.05 16 4.05 4.05 9.47 4.05 16 9.46 27.95 16 27.95 ZM 16 25.96 C 10.47 25.96 6.05 21.53 6.05 16 S 10.47 6.04 16 6.04 25.95 10.47 25.95 16 21.53 25.96 16 25.96 Z"/>
      <path fill="currentColor" d="M 21.82 20.44 L 17.46 16.08 21.97 11.58 20.58 10.19 16.07 14.70 11.56 10.18 10.17 11.57 14.69 16.08 10.19 20.58 11.58 21.97 16.07 17.47 20.43 21.83 21.82 20.44 Z"/>
    </svg>`;
  closeBtn.style.display = "block";
  closeBtn.addEventListener("click", () => {
    console.log("✅ CLICK FUNCIONA");
    const panel = document.querySelector(".project-detail-panel");
    if (panel) {
      panel.classList.add("exiting");
      closeBtn.style.display = "none";
      setTimeout(() => panel.remove(), 500);
    }
  });
  container.appendChild(closeBtn);

  // Panel
  const newPanel = document.createElement("div");
  newPanel.className = `project-detail-panel entering ${direction}`;
  const contentContainer = document.createElement("div");
  contentContainer.className = "detail-content";
  newPanel.appendChild(contentContainer);

  const group = document.createElement("div");
  group.className = "Group";
  const content = document.createElement("div");
  content.className = "content02";
  content.innerHTML = `
    <h3>${project.title}</h3>
    <div class="description"><p>${project.description}</p></div>
    <div class="roles">
      ${project.roles.map(r => `<div><p>${r}</p></div>`).join("")}
    </div>`;

  const gallery = document.createElement("div");
  gallery.className = "grid-container-01";
  project.gallery.slice(0, 3).forEach((item, i) => {
    const className = `img-${String.fromCharCode(97 + i)}`;
    const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(item);
    gallery.innerHTML += isVideo
      ? `<div class="${className}"><video src="${item}" autoplay muted loop playsinline></video></div>`
      : `<div class="${className}"><img src="${item}" alt="Image ${i + 1}" /></div>`;
  });

  group.appendChild(content);
  group.appendChild(gallery);
  contentContainer.appendChild(group);

  // Secciones
  project.sections.forEach(section => {
    const sectionGroup = document.createElement("div");
    sectionGroup.className = "Group";

    const sectionContent = document.createElement("div");
    sectionContent.className = "content02";
    sectionContent.innerHTML = `
      <h4>${section.title}</h4>
      ${section.subtitle ? `<p class="section-subtitle">${section.subtitle}</p>` : ""}`;
    sectionGroup.appendChild(sectionContent);

    const sectionBody = document.createElement("div");
    sectionBody.className = section.type;

    if (section.type === "objective-container" || section.type === "stats-container") {
      section.content.forEach(item => {
        const match = item.match(/^(.+?<span>.*?<\/span>|[\d.,]+%?|[\d.,]+)(.*)$/);
        if (match) {
          const num = match[1].trim();
          const desc = match[2].trim();
          sectionBody.innerHTML += `<div><p>${num}</p><p>${desc}</p></div>`;
        } else {
          sectionBody.innerHTML += `<div><p>${item}</p></div>`;
        }
      });
    } else if (section.type === "HowMightWe") {
      sectionBody.innerHTML = `<p class="HMW">${section.content}</p>`;
    } else if (section.type.includes("grid-container")) {
      section.content.forEach(block => {
        const isVideo = block.type === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(block.src || "");
        const isImage = block.type === "img" || /\.(jpg|jpeg|png|gif|svg)(\?|$)/i.test(block.src || "");
        const isText = block.type === "text" || block.text;

        let contentHTML = "";
        if (isVideo) {
          contentHTML = `<video src="${block.src}" class="${block.class || ""}" autoplay muted loop playsinline></video>`;
        } else if (isImage) {
          contentHTML = `<img src="${block.src}" class="${block.class || ""}" />`;
        } else if (isText) {
          contentHTML = `<div class="${block.class || ""}"><p>${block.text}</p></div>`;
        }
        sectionBody.innerHTML += contentHTML;
      });
    } else {
      section.content.forEach(block => {
        sectionBody.innerHTML += `<div class="${block.class || ""}"><p>${block.text}</p></div>`;
      });
    }

    sectionGroup.appendChild(sectionBody);
    contentContainer.appendChild(sectionGroup);
  });

  // Navegacion Prev/Next
  const navigation = document.createElement("div");
  navigation.className = "project-navigation";
  navigation.innerHTML = `
    <button id="prevProject">< Prev</button>
    <button id="nextProject">Next ></button>`;
  contentContainer.appendChild(navigation);

  navigation.querySelector("#prevProject")?.addEventListener("click", () => {
    const currentIndex = allProjects.findIndex(p => p._id === project._id);
    const prevIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
    openProjectFromData(allProjects[prevIndex], allProjects, "prev");
  });

  navigation.querySelector("#nextProject")?.addEventListener("click", () => {
    const currentIndex = allProjects.findIndex(p => p._id === project._id);
    const nextIndex = (currentIndex + 1) % allProjects.length;
    openProjectFromData(allProjects[nextIndex], allProjects, "next");
  });

  container.appendChild(newPanel);
  requestAnimationFrame(() => {
    newPanel.classList.remove("entering");
  });

  const oldPanels = container.querySelectorAll(".project-detail-panel");
  if (oldPanels.length > 1) {
    const oldPanel = oldPanels[0];
    oldPanel.classList.add("exiting");
    setTimeout(() => oldPanel.remove(), 300);
  }

  updateInfoPanelBorder();
}

// CARGAR PROYECTOS
fetch("https://portfolio-backend-cj5g.onrender.com/api/projects")
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById("projectCardMenuContainer");
    if (!container) return;
    container.innerHTML = "";

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "cardMenu";
      card.innerHTML = `
        <img src="${project.gallery?.[0]}" class="img-a" alt="Project Image" />
        <p>${project.category}</p>
        <h4>${project.title}</h4>`;

      card.addEventListener("click", () => {
        openProjectFromData(project, projects);
        projectsPanel?.classList.remove("active");
        infoPanel?.classList.remove("active");
      });

      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error al cargar los proyectos:", err));
