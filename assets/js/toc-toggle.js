document.addEventListener("DOMContentLoaded", () => {

    // TOC container
    const tocContainer = document.querySelector(".toc-container");
    const tocHeader = tocContainer?.querySelector(".toc-header");

    if (tocContainer && tocHeader) {
    tocHeader.addEventListener("click", () => {
        const isOpen = tocContainer.classList.toggle("is-open");
        tocHeader.setAttribute("aria-expanded", isOpen);
    });
    }

    

    const toc = document.querySelector("ul.toc");
    if (!toc) return;

    const tocItems = toc.querySelectorAll("li");

    tocItems.forEach(li => {
    const nested = li.querySelector(":scope > ul");
    if (!nested) return;

    const button = document.createElement("button");
    button.className = "toc-toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Toggle subsections");

    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="toc-icon"
            aria-hidden="true">
        <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;

    const link = li.querySelector(":scope > a");
    link?.after(button);

    button.addEventListener("click", e => {
    e.preventDefault();

    const isExpanded = li.classList.contains("is-expanded");
    const parentList = li.parentElement;

    // Collapse siblings at the same level
    parentList.querySelectorAll(":scope > li.is-expanded").forEach(item => {
        if (item !== li) {
        item.classList.remove("is-expanded");
        item.querySelector(".toc-toggle")
            ?.setAttribute("aria-expanded", "false");
        }
    });

    // Toggle current item
    li.classList.toggle("is-expanded", !isExpanded);
    button.setAttribute("aria-expanded", String(!isExpanded));
    });
    });

    /* Auto-expand current section */
    const currentHash = decodeURIComponent(location.hash);
    if (currentHash) {
    const activeLink = toc.querySelector(`a[href="${currentHash}"]`);
    if (activeLink) {
        let currentLi = activeLink.closest("li");

        while (currentLi && currentLi.closest("ul.toc")) {
        currentLi.classList.add("is-expanded");
        currentLi.querySelector(".toc-toggle")
            ?.setAttribute("aria-expanded", "true");

        currentLi = currentLi.parentElement.closest("li");
        }
    }
    }

});
