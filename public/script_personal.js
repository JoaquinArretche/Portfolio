fetch("/api/info")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("personalContentContainer");
    if (!container || !data) return;

    container.innerHTML = `
      <div class="personalInfo">
        ${data.personalInfo.map((p) => `<p>${p}</p>`).join("")}
      </div>

      <div class="contact">
  <div>
  <h4>Contact</h4>
  <p><a href="mailto:${data.contact.email}" class="mail">${
      data.contact.email
    }</a></p>
</div>

        <div>
          <h4>Location</h4>
          <p>${data.contact.location
            .map((loc, i, arr) => {
              const isLast = i === arr.length - 1;
              return isLast ? loc : `<del>${loc}</del>`;
            })
            .join(", ")}</p>
        </div>

        <div class="links">
          <h4>Links</h4>
          ${data.contact.links
            .map(
              (link) => `
            <div>
              <a href="${link.href}" target="_blank">
                ${link.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M6 6H18V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </a>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  })
  .catch((err) => console.error("Error al cargar info:", err));

fetch("/api/info-panel")
  .then((res) => res.json())
  .then((data) => {
    const infoPanelContent = document.getElementById("infoPanelContent");
    if (!infoPanelContent || !data) return;

    infoPanelContent.innerHTML = `
      <h2>Info</h2>
      <div class="infoFlex">
      <img src="${data.image}" alt="infoPic" class="infoPic">

      <div>
            <p class="infop"><span>Biography</span>${data.biography}</p>
            <p class="infop"><span>Skills</span>${data.skills}</p>
            <p class="infop"><span>Vision</span>${data.vision}</p>
            <p>${data.openTo}</p>
      
            <p><span>Awards & Talks</span></p>
            <ul>
              ${data.awards
                .map(
                  (award) => `
                <a href="${award.link}" target="_blank">
                  <li>${award.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M6 6H18V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </li>
                </a>`
                )
                .join("")}
            </ul>
      </div>
      </div>

      <div class="end">
        <div>
          <p>You’ve reached the bottom of the page —</p>
          <h2>Thank you</h2>
        </div>
        <div id="update">
          <p>Last update: ${data.lastUpdate}</p>
        </div>
      </div>
    `;
  })
  .catch((err) => console.error("Error al cargar info panel:", err));
