
"use strict";

const CONTENT_PATH = "content.json";

const CONFIG = {
    logo: "assets/images/logo/eoc-youth-logo.png",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Emmanuel+Outreach+Centre+08+Disa+Place+Asherville+Durban",
    whatsappNumber: "27670096591",
    idmUrl: "https://icarusdigi.github.io/site/",
    instagramUrl: "https://www.instagram.com/"
};

let siteData = null;
let currentBook = null;

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getBook(id) {
    return siteData?.books?.find(book => book.id === id);
}

function getChapter(book, number) {
    return book?.chapters?.find(chapter => Number(chapter.number) === Number(number));
}

function bookUrl(bookId) {
    return `book.html?book=${encodeURIComponent(bookId)}`;
}

function chapterUrl(bookId, chapterNumber) {
    return `chapter.html?book=${encodeURIComponent(bookId)}&chapter=${Number(chapterNumber)}`;
}

function imagePath(path) {
    return path || "";
}

function renderImage(path, alt, className = "") {
    if (!path) return "";

    return `
        <img class="${escapeHTML(className)}"
             src="${escapeHTML(imagePath(path))}"
             alt="${escapeHTML(alt)}"
             loading="lazy"
             onerror="this.remove()">
    `;
}

function renderHeader() {
    const target = $("#site-header");
    if (!target) return;

    target.innerHTML = `
        <header class="site-header">
            <div class="container nav-inner">
                <a class="brand" href="index.html" aria-label="EOC Youth home">
                    ${CONFIG.logo
                        ? `<img src="${escapeHTML(CONFIG.logo)}" alt="EOC Youth logo" onerror="this.outerHTML='<span class=\\'brand-fallback\\'>EOC</span>'">`
                        : `<span class="brand-fallback">EOC</span>`
                    }
                    <span class="brand-copy">
                        <strong>EOC YOUTH</strong>
                        <small>GROW IN THE WORD</small>
                    </span>
                </a>

                <button class="menu-toggle" type="button"
                    aria-label="Open navigation" aria-expanded="false"
                    aria-controls="primary-navigation">☰</button>

                <nav class="site-nav" id="primary-navigation" aria-label="Main navigation">
                    <a href="index.html" data-nav="home">Home</a>
                    <a href="${bookUrl("acts")}" data-nav="acts">Acts</a>
                    <a href="${bookUrl("romans")}" data-nav="romans">Romans</a>
                    <a href="${bookUrl("john")}" data-nav="john">John</a>
                    <a href="contact.html" class="nav-contact" data-nav="contact">Contact us ↗</a>
                </nav>
            </div>
        </header>
    `;

    const toggle = $(".menu-toggle", target);
    const nav = $(".site-nav", target);

    toggle?.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        document.body.classList.toggle("menu-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        toggle.textContent = isOpen ? "×" : "☰";
    });

    $$(".site-nav a", target).forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            document.body.classList.remove("menu-open");
            toggle?.setAttribute("aria-expanded", "false");
        });
    });

    const params = new URLSearchParams(location.search);
    const page = location.pathname.split("/").pop().toLowerCase();

    let activeNav = "home";

    if (page === "contact.html") {
        activeNav = "contact";
    } else if (page === "book.html" || page === "chapter.html") {
        activeNav = params.get("book") || "home";
    }

    const activeLink = $(`[data-nav="${activeNav}"]`, target);
    activeLink?.setAttribute("aria-current", "page");
}

function renderFooter() {
    const target = $("#site-footer");
    if (!target) return;

    const year = new Date().getFullYear();

    target.innerHTML = `
        <footer class="site-footer">
            <div class="container footer-main">
                <div class="footer-brand">
                    <a class="brand" href="index.html">
                        <span class="brand-fallback">EOC</span>
                        <span class="brand-copy">
                            <strong>EOC YOUTH</strong>
                            <small>EMMANUEL OUTREACH CENTRE</small>
                        </span>
                    </a>
                    <p>
                        Growing in faith, building friendships and learning
                        to live out the truth of God's Word.
                    </p>
                </div>

                <div class="footer-column">
                    <h3>QUICK LINKS</h3>
                    <div class="footer-links">
                        <a href="index.html">Home</a>
                        <a href="${bookUrl("acts")}">Acts study notes</a>
                        <a href="${bookUrl("romans")}">Romans study notes</a>
                        <a href="${bookUrl("john")}">Gospel of John</a>
                        <a href="contact.html">Contact us</a>
                    </div>
                </div>

                <div class="footer-column">
                    <h3>CONTACT & FELLOWSHIP</h3>
                    <div class="footer-links">
                        <a href="tel:+27813604450">+27 81 360 4450</a>
                        <a href="mailto:youth.emc00@gmail.com">youth.emc00@gmail.com</a>
                        <a href="${CONFIG.mapUrl}" target="_blank" rel="noopener noreferrer">
                            Asherville, Durban · Find us
                        </a>
                        <span>Fridays · 19:00–21:00</span>
                    </div>
                </div>
            </div>

            <div class="container footer-bottom">
                <p>© ${year} Emmanuel Outreach Centre Youth. All rights reserved.</p>
                <p>Developed &amp; maintained by
                    <a href="${CONFIG.idmUrl}" target="_blank" rel="noopener noreferrer">
                        IDM.
                    </a>
                </p>
            </div>
        </footer>
    `;
}

function renderBookCard(book) {
    const chapterCount = book.chapters.length;

    return `
        <article class="book-card" data-book-card="${escapeHTML(book.id)}">
            <a href="${bookUrl(book.id)}" aria-label="Explore ${escapeHTML(book.title)}">
                <div class="book-art"
                    style="--book-glow:${escapeHTML(book.glow || "#485c9c")};
                    ${book.cover ? `background-image:linear-gradient(0deg,rgba(5,9,20,.6),transparent),url('${escapeHTML(book.cover)}')` : ""}">
                    ${renderImage(book.cover, `${book.title} cover`)}
                    <span class="book-number">${escapeHTML(book.label || "BIBLE STUDY")}</span>
                </div>
            </a>
            <div class="book-card-content">
                <h3>${escapeHTML(book.title)}</h3>
                <p>${escapeHTML(book.shortDescription)}</p>
                <div class="card-meta">
                    <span>${chapterCount} chapters available</span>
                    <span>${escapeHTML(book.testament || "New Testament")}</span>
                </div>
                <a class="card-link" href="${bookUrl(book.id)}">
                    Explore this book <span>→</span>
                </a>
            </div>
        </article>
    `;
}

function renderHome() {
    const grid = $("#book-grid");
    if (!grid) return;

    grid.innerHTML = siteData.books.map(renderBookCard).join("");

    const filterButtons = $$(".filter-button");
    const count = $("#library-count");

    function applyFilter(filter) {
        let visible = 0;

        $$("[data-book-card]", grid).forEach(card => {
            const show = filter === "all" || card.dataset.bookCard === filter;
            card.hidden = !show;
            if (show) visible++;
        });

        filterButtons.forEach(button => {
            const active = button.dataset.filter === filter;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        if (count) {
            count.textContent = `${visible} study collection${visible === 1 ? "" : "s"}`;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => applyFilter(button.dataset.filter));
    });

    applyFilter("all");
}

function renderBookPage() {
    const target = $("#book-page");
    if (!target) return;

    const params = new URLSearchParams(location.search);
    const book = getBook(params.get("book"));

    if (!book) {
        target.innerHTML = `
            <div class="error-message">
                <h1>Study not found</h1>
                <p>Choose Acts, Romans or the Gospel of John from the study library.</p>
                <a class="button button-primary" href="index.html">Return to studies</a>
            </div>`;
        return;
    }

    currentBook = book;
    document.title = `${book.title} Bible Study | EOC Youth`;

    const chapters = book.chapters;

    target.innerHTML = `
        <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a><span>/</span><span>${escapeHTML(book.title)}</span>
        </nav>

        <section class="page-hero" style="--book-glow:${escapeHTML(book.glow || "#485c9c")}">
            ${renderImage(book.cover, `${book.title} artwork`)}
            <span class="eyebrow">${escapeHTML(book.label || "BIBLE STUDY COLLECTION")}</span>
            <h1>${escapeHTML(book.title)}</h1>
            <p class="hero-description">${escapeHTML(book.shortDescription)}</p>
            <div class="hero-note">
                <span class="status-dot"></span>
                ${chapters.length} chapter studies · Overview, insight, summary and themes
            </div>
        </section>

        <section class="page-section">
            <div class="section-kicker">INTRODUCTION</div>
            <div class="overview-panel">
                <h2>About this book</h2>
                <p>${escapeHTML(book.overview)}</p>
                <p>${escapeHTML(book.purpose || "")}</p>
                <h3>Major themes</h3>
                <div class="theme-list">
                    ${(book.themes || []).map(theme =>
                        `<span class="theme-chip">${escapeHTML(theme)}</span>`
                    ).join("")}
                </div>
            </div>
        </section>

        <section class="page-section" id="chapters">
            <div class="section-kicker">CHAPTER-BY-CHAPTER</div>
            <h2>Explore the chapters</h2>
            <p>Choose a chapter below, or use the filters to find a particular study.</p>

            <div class="chapter-tools">
                <label>
                    Filter chapters
                    <select id="chapter-filter" aria-label="Filter chapters">
                        <option value="all">All chapters</option>
                        ${chapters.map(chapter =>
                            `<option value="${chapter.number}">Chapter ${chapter.number}</option>`
                        ).join("")}
                    </select>
                </label>
                <input class="chapter-search" id="chapter-search" type="search"
                    placeholder="Search chapter titles..." aria-label="Search chapter titles">
            </div>

            <div id="chapter-grid" class="chapter-grid">
                ${chapters.map(chapter => `
                    <a class="chapter-card"
                       href="${chapterUrl(book.id, chapter.number)}"
                       data-chapter-number="${chapter.number}"
                       data-search="${escapeHTML((chapter.title + " " + chapter.summary).toLowerCase())}">
                        <span class="chapter-label">CHAPTER ${String(chapter.number).padStart(2, "0")}</span>
                        <h3>${escapeHTML(chapter.title)}</h3>
                        <p>${escapeHTML(chapter.summary)}</p>
                        <span class="card-link">Read study notes <span>→</span></span>
                    </a>
                `).join("")}
            </div>
            <p id="chapter-empty" class="empty-message" hidden>No chapters match your search.</p>
        </section>
    `;

    const chapterFilter = $("#chapter-filter");
    const chapterSearch = $("#chapter-search");
    const chapterCards = $$(".chapter-card");
    const emptyMessage = $("#chapter-empty");

    function filterChapters() {
        const selected = chapterFilter.value;
        const query = chapterSearch.value.trim().toLowerCase();
        let visible = 0;

        chapterCards.forEach(card => {
            const matchesNumber = selected === "all" || card.dataset.chapterNumber === selected;
            const matchesText = card.dataset.search.includes(query);
            const show = matchesNumber && matchesText;

            card.hidden = !show;
            if (show) visible++;
        });

        emptyMessage.hidden = visible !== 0;
    }

    chapterFilter.addEventListener("change", filterChapters);
    chapterSearch.addEventListener("input", filterChapters);
}

function renderChapterPage() {
    const target = $("#chapter-page");
    if (!target) return;

    const params = new URLSearchParams(location.search);
    const book = getBook(params.get("book"));
    const chapterNumber = Number(params.get("chapter"));
    const chapter = getChapter(book, chapterNumber);

    if (!book || !chapter || !Number.isInteger(chapterNumber)) {
        target.innerHTML = `
            <div class="error-message">
                <h1>Chapter not found</h1>
                <p>Please select a book and chapter from the study library.</p>
                <a class="button button-primary" href="index.html">Return to studies</a>
            </div>`;
        return;
    }

    currentBook = book;
    document.title = `${book.title} ${chapter.number} | EOC Youth`;

    const previous = getChapter(book, chapter.number - 1);
    const next = getChapter(book, chapter.number + 1);

    target.innerHTML = `
        <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a><span>/</span>
            <a href="${bookUrl(book.id)}">${escapeHTML(book.title)}</a><span>/</span>
            <span>Chapter ${chapter.number}</span>
        </nav>

        <section class="page-hero" style="--book-glow:${escapeHTML(book.glow || "#485c9c")}">
            ${renderImage(chapter.image, `${book.title} chapter ${chapter.number} artwork`)}
            <span class="eyebrow">${escapeHTML(book.title.toUpperCase())} · CHAPTER ${chapter.number}</span>
            <h1>${escapeHTML(chapter.title)}</h1>
            <p class="hero-description">${escapeHTML(chapter.summary)}</p>
            <div class="hero-actions">
                <a href="#overview" class="button button-primary">Begin this study <span>↓</span></a>
                <a href="${bookUrl(book.id)}#chapters" class="button button-outline">All chapters</a>
            </div>
        </section>

        <div class="study-layout">
            <article class="study-content">
                <section class="study-block" id="overview">
                    <div class="section-kicker">01 · UNDERSTAND THE TEXT</div>
                    <h2>Chapter overview</h2>
                    <p>${escapeHTML(chapter.overview)}</p>
                </section>

                <section class="study-block insight-block">
                    <div class="section-kicker">02 · GO DEEPER</div>
                    <h2>Insight</h2>
                    <p>${escapeHTML(chapter.insight)}</p>
                </section>

                <section class="study-block">
                    <div class="section-kicker">03 · THE BIG PICTURE</div>
                    <h2>Chapter summary</h2>
                    <p>${escapeHTML(chapter.summary)}</p>
                </section>

                <section class="study-block">
                    <div class="section-kicker">04 · IMPORTANT IDEAS</div>
                    <h2>Chapter themes</h2>
                    <ul>${chapter.themes.map(theme => `<li>${escapeHTML(theme)}</li>`).join("")}</ul>
                </section>

                <section class="study-block key-verse">
                    <div class="section-kicker">05 · REMEMBER THIS</div>
                    <h2>Key verse</h2>
                    <p class="verse-reference">${escapeHTML(chapter.keyVerse.reference)} · ${escapeHTML(chapter.keyVerse.translation || "NIV")}</p>
                    <p class="verse-text">${escapeHTML(chapter.keyVerse.thought)}</p>
                    <p class="muted">Study the complete verse in your Bible, in context.</p>
                </section>

                ${chapter.questions?.length ? `
                    <section class="study-block">
                        <div class="section-kicker">06 · REFLECT AND DISCUSS</div>
                        <h2>Study questions</h2>
                        ${chapter.questions.map((item, index) => `
                            <details class="question-item">
                                <summary>${index + 1}. ${escapeHTML(item.question)}</summary>
                                <p>${escapeHTML(item.answer)}</p>
                            </details>
                        `).join("")}
                    </section>
                ` : ""}

                <nav class="chapter-pagination" aria-label="Chapter navigation">
                    ${previous
                        ? `<a class="pagination-link" href="${chapterUrl(book.id, previous.number)}">
                               <small>← PREVIOUS CHAPTER</small>
                               <strong>${escapeHTML(previous.title)}</strong>
                           </a>`
                        : `<a class="pagination-link" href="${bookUrl(book.id)}">
                               <small>← BACK TO</small><strong>${escapeHTML(book.title)}</strong>
                           </a>`
                    }
                    ${next
                        ? `<a class="pagination-link" href="${chapterUrl(book.id, next.number)}" style="text-align:right;margin-left:auto">
                               <small>NEXT CHAPTER →</small>
                               <strong>${escapeHTML(next.title)}</strong>
                           </a>`
                        : `<a class="pagination-link" href="${bookUrl(book.id)}" style="text-align:right;margin-left:auto">
                               <small>FINISHED THE BOOK?</small><strong>Return to overview →</strong>
                           </a>`
                    }
                </nav>
            </article>

            <aside class="study-sidebar">
                <h3>${escapeHTML(book.title)} chapters</h3>
                <div class="chapter-select">
                    ${book.chapters.map(item => `
                        <a class="${item.number === chapter.number ? "current" : ""}"
                           ${item.number === chapter.number ? 'aria-current="page"' : ""}
                           href="${chapterUrl(book.id, item.number)}">
                            ${String(item.number).padStart(2, "0")} · ${escapeHTML(item.title)}
                        </a>
                    `).join("")}
                </div>
            </aside>
        </div>
    `;
}

function setupContactForm() {
    const form = $("#whatsapp-contact-form");
    if (!form) return;

    const mapLink = $("#map-link");
    if (mapLink) mapLink.href = CONFIG.mapUrl;

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const name = $("#contact-name").value.trim();
        const topic = $("#contact-topic").value;
        const message = $("#contact-message").value.trim();

        const text = [
            "Hello EOC Youth!",
            "",
            `My name is ${name}.`,
            `Enquiry: ${topic}`,
            "",
            message,
            "",
            "I contacted you through the EOC Youth Bible Study website."
        ].join("\n");

        const whatsappUrl =
            `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;

        const feedback = $("#contact-feedback");
        if (feedback) {
            feedback.textContent = "Opening WhatsApp. Please review your message and press Send.";
        }

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
}

function hideLoader() {
    const loader = $("#site-loader");
    if (!loader) return;
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 650);
}

async function initialiseSite() {
    renderHeader();
    renderFooter();

    try {
        const response = await fetch(CONTENT_PATH, { cache: "no-cache" });

        if (!response.ok) {
            throw new Error(`Could not load content.json (${response.status})`);
        }

        siteData = await response.json();

        if (!Array.isArray(siteData.books)) {
            throw new Error("The study data has an invalid structure.");
        }

        renderHome();
        renderBookPage();
        renderChapterPage();
        setupContactForm();
    } catch (error) {
        console.error("EOC Youth study site:", error);

        const message = `
            <div class="error-message">
                <h2>We couldn't load the study notes.</h2>
                <p>Please check that content.json is in the project root and open the
                website through VS Code Live Server, rather than directly as a file.</p>
                <p>${escapeHTML(error.message)}</p>
            </div>`;

        ["#book-grid", "#book-page", "#chapter-page"].forEach(selector => {
            const target = $(selector);
            if (target) target.innerHTML = message;
        });
    } finally {
        hideLoader();
    }
}

document.addEventListener("DOMContentLoaded", initialiseSite);