document.addEventListener("DOMContentLoaded", () => {

    // ---- Fetch and render menu ----
    const fetchMenu = async () => {
        try {
            const res = await fetch("./assets/json/menu.json");
            const menuData = await res.json();

            const getNested = (obj, path) => path.split('.').reduce((acc, key) => acc && acc[key], obj);

            const renderList = (container, items) => {
                if (!container || !Array.isArray(items)) return;
                container.innerHTML = "";
                const fragment = document.createDocumentFragment();
                items.forEach(item => {
                    const wrap = document.createElement("div");
                    wrap.className = "py-3 border-bottom";
                    wrap.innerHTML = `
                        <div class="row">
                            <div class="col-3 align-self-center">
                                <div class="ratio ratio-1x1">
                                    <img class="object-fit-cover" src="${item.image || ''}" alt="${item.title || ''}">
                                </div>
                            </div>
                            <div class="col-7">
                                <h5 class="mb-2">${item.title || ''}</h5>
                                ${item.description ? `<p class="mb-0">${item.description}</p>` : ""}
                            </div>
                        </div>
                    `;
                    fragment.appendChild(wrap);
                });
                container.appendChild(fragment);
            };

            const renderGrid = (container, items) => {
                if (!container || !Array.isArray(items)) return;
                container.innerHTML = "";
                const fragment = document.createDocumentFragment();
                items.forEach(item => {
                    const col = document.createElement("div");
                    col.className = "col-12 col-md-6 mb-3";
                    col.innerHTML = `
                        <div class="py-3 border-bottom">
                            <div class="row">
                                <div class="col-3 align-self-center">
                                    <div class="ratio ratio-1x1">
                                        <img class="object-fit-cover" src="${item.image || ''}" alt="${item.title || ''}">
                                    </div>
                                </div>
                                <div class="col-7">
                                    <h5 class="mb-2">${item.title || ''}</h5>
                                    ${item.description ? `<p class="mb-0">${item.description}</p>` : ""}
                                </div>
                            </div>
                        </div>
                    `;
                    fragment.appendChild(col);
                });
                container.appendChild(fragment);
            };

            const renderJain = (container, items) => {
                if (!container || !Array.isArray(items)) return;
                container.innerHTML = "";
                const fragment = document.createDocumentFragment();
                items.forEach(item => {
                    const wrap = document.createElement("div");
                    wrap.className = "py-3 text-center";
                    wrap.innerHTML = `
                        <h5 class="mb-1">${item.title || ''}</h5>
                        ${item.description ? `<p class="mb-0">${item.description}</p>` : ""}
                    `;
                    fragment.appendChild(wrap);
                });
                container.appendChild(fragment);
            };

            const renderPopular = (container, items) => {
                if (!container || !Array.isArray(items)) return;
                container.innerHTML = "";
                const fragment = document.createDocumentFragment();
                items.forEach(item => {
                    const col = document.createElement("div");
                    col.className = "col-12 col-md-4 mb-4";
                    col.innerHTML = `
                        <div class="card text-center shadow-sm border-0">
                            <a href="${item.image || ''}" class="glightbox" data-gallery="popular">
                                <img src="${item.image || ''}" class="card-img-top" alt="${item.title || ''}">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">${item.title || ''}</h5>
                                ${item.description ? `<p class="card-text">${item.description}</p>` : ''}
                            </div>
                        </div>
                    `;
                    fragment.appendChild(col);
                });
                container.appendChild(fragment);
            };

            // ---- Render all sections ----
            document.querySelectorAll("[data-menu-section]").forEach(container => {
                const path = container.getAttribute("data-menu-section");
                const type = container.getAttribute("data-type");
                const items = getNested(menuData, path);

                switch (type) {
                    case "list": renderList(container.querySelector(".items"), items); break;
                    case "grid": renderGrid(container.querySelector(".grid") || container, items); break;
                    case "jain": renderJain(container, items); break;
                    case "popular": renderPopular(container, items); break;
                }
            });

        } catch (err) {
            console.error("Error loading menu.json:", err);
        }
    };

    fetchMenu();

    // ---- Image fallback ----
    const hideBrokenImages = img => {
        if (!img || img.tagName !== "IMG") return;
        if (!img.src) { img.style.display = "none"; return; }
        img.onerror = () => { img.style.display = "none"; };
    };
    document.querySelectorAll("img").forEach(hideBrokenImages);
    new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.type === "attributes" && m.attributeName === "src" && m.target.tagName === "IMG") hideBrokenImages(m.target);
            m.addedNodes.forEach(n => {
                if (n.nodeType === 1) {
                    if (n.tagName === "IMG") hideBrokenImages(n);
                    n.querySelectorAll?.("img").forEach(hideBrokenImages);
                }
            });
        });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

    // ---- GLightbox ----
    GLightbox({ selector: '.glightbox' });

    // ---- Smooth scrolling + active highlight ----
    const subTabs = Array.from(document.querySelectorAll("[data-menu-subtab]"));
    const sections = subTabs.map(tab => document.getElementById(tab.getAttribute("data-menu-subtab")));
    const mainTabs = document.querySelectorAll("#menuTabs .nav-link");

    const getHeaderOffset = () => {
        const nav = document.querySelector("header");
        return nav ? nav.offsetHeight : 100;
    };

    const scrollToSection = (el) => {
        const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({ top, behavior: 'smooth' });
    };

    subTabs.forEach(tab => {
        tab.addEventListener("click", e => {
            e.preventDefault();
            const targetEl = document.getElementById(tab.getAttribute("data-menu-subtab"));
            if (targetEl) scrollToSection(targetEl);
        });
    });

    const updateActiveTabs = () => {
        const scrollPos = window.scrollY + getHeaderOffset() + 20;

        // Sub-tabs
        sections.forEach((sec, idx) => {
            if (!sec) return;
            const nextSec = sections[idx + 1];
            if (scrollPos >= sec.offsetTop && (!nextSec || scrollPos < nextSec.offsetTop)) {
                subTabs.forEach(t => t.classList.remove("active"));
                subTabs[idx].classList.add("active");
            }
        });

        // Main tabs
        const sectionsMain = ["lunch", "dinner", "jain", "dessert"].map(id => document.getElementById(id));
        sectionsMain.forEach((sec, idx) => {
            if (!sec) return;
            const nextSec = sectionsMain[idx + 1];
            if (scrollPos >= sec.offsetTop && (!nextSec || scrollPos < nextSec.offsetTop)) {
                mainTabs.forEach(t => t.classList.remove("active"));
                mainTabs[idx].classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", updateActiveTabs);
    window.addEventListener("resize", updateActiveTabs);

});
