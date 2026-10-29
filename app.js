/* =========================================================
   0. INJECTION HEADER / FOOTER — source unique
   ---------------------------------------------------------
   Chaque page contient uniquement :
     <header class="site-header" data-site-header data-root=""></header>
     <footer id="contact" class="site-footer" data-site-footer data-root=""></footer>
   data-root = "" à la racine, "../" dans un sous-dossier.
   Ce bloc s'exécute avant tout le reste (defer → DOM déjà parsé).
   ========================================================= */
window.CNDT_SITE = { root: '' };

(() => {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  if (!header && !footer) return;

  window.CNDT_SITE.root = (header || footer).dataset.root || '';

  /* ---------- Template du header ---------- */
  if (header) {
    header.outerHTML = `
<header class="site-header">
  <div class="utility-bar">
    <div class="utility-inner">
      <p>République du Cameroun <span>Paix · Travail · Patrie</span></p>
      <div class="utility-links">
        <a href="mailto:contact@cndtcameroun.cm">contact@cndtcameroun.cm</a>
        <span aria-hidden="true">|</span>
        <a href="#" lang="en" aria-label="English version">English</a>
      </div>
    </div>
  </div>

  <div class="main-nav-wrap">
    <div class="main-nav">
      <a class="brand" href="${window.CNDT_SITE.root}index.html" aria-label="Accueil du CNDT">
        <img src="${window.CNDT_SITE.root}assets/logo-cndt.webp" alt="Logo du CNDT">
        <span class="brand-copy">
          <strong>Comité National de Développement des Technologies</strong>
          <small>La technologie au service du développement</small>
        </span>
      </a>

      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
        <span class="menu-toggle-lines" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Menu</span>
      </button>

      <nav id="primary-nav" class="primary-nav" aria-label="Navigation principale">
        <a href="${window.CNDT_SITE.root}index.html">Accueil</a>

        <button
          type="button"
          class="primary-nav__trigger"
          aria-expanded="false"
          aria-controls="mega-organisation"
          data-mega-trigger
        >
          <span>Secrétariats Permanents</span>
          <svg class="primary-nav__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6.4 9.2 12 14.8l5.6-5.6-1.4-1.4L12 12l-4.2-4.2z"/>
          </svg>
        </button>

        <a href="${window.CNDT_SITE.root}actualites.html">Actualités</a>
        <a href="${window.CNDT_SITE.root}publication.html">Publications</a>
        <a href="${window.CNDT_SITE.root}contact.html">Contact</a>

        <div class="nav-search" data-nav-search role="search">
          <form class="nav-search__form" autocomplete="off" novalidate>
            <label class="visually-hidden" for="nav-search-input">Rechercher sur le site</label>

            <svg class="nav-search__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M10 4a6 6 0 1 0 3.9 10.56l4.27 4.27 1.41-1.41-4.27-4.27A6 6 0 0 0 10 4Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/>
            </svg>

            <input
              id="nav-search-input"
              class="nav-search__input"
              type="search"
              name="q"
              placeholder="Rechercher…"
              aria-autocomplete="list"
              aria-controls="nav-search-results"
              aria-expanded="false"
              data-nav-search-input
            >

            <button
              class="nav-search__clear"
              type="button"
              aria-label="Effacer la recherche"
              data-nav-search-clear
              hidden
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
              </svg>
            </button>
          </form>

          <div
            id="nav-search-results"
            class="nav-search__results"
            role="listbox"
            aria-label="Résultats de recherche"
            hidden
            data-nav-search-results
          ></div>
        </div>

        <ul class="nav-socials" aria-label="Nos réseaux sociaux">
          <li>
            <a href="https://www.facebook.com/cndtcameroun"
              target="_blank" rel="noopener"
              aria-label="Page Facebook du CNDT"
              class="nav-social nav-social--facebook">
              <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/channel/UC3OfHkDXBNVGwiI8henjNww"
              target="_blank" rel="noopener"
              aria-label="Chaîne YouTube du CNDT"
              class="nav-social nav-social--youtube">
              <i class="fa-brands fa-youtube" aria-hidden="true"></i>
            </a>
          </li>
        </ul>

        <div
          id="mega-organisation"
          class="mega-menu"
          aria-hidden="true"
          data-mega-menu
        >
          <div class="mega-menu__inner">
            <div class="container">

              <div class="mega-menu__head">
                <p class="mega-menu__eyebrow">Explorer l'organisation du CNDT</p>
                <button
                  type="button"
                  class="mega-menu__close"
                  aria-label="Fermer le menu Organisation"
                  data-mega-close
                >
                  Fermer
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
                  </svg>
                </button>
              </div>

              <div class="mega-menu__grid">

                <div class="mega-menu__col">
                  <ul class="mega-menu__list">
                    <li>
                      <a href="${window.CNDT_SITE.root}index.html#institution">
                        <span>Mot du Secrétaire Permanent</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}comite.html">
                        <span>Comité</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}cabinet.html">
                        <span>Cabinet du Secrétaire Permanent</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="mega-menu__col">
                  <ul class="mega-menu__list">
                    <li>
                      <a href="${window.CNDT_SITE.root}crmp.html">
                        <span>Commission recherche et management des projets</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}caaf.html">
                        <span>Commission des affaires administratives, financières et des engagements</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}cdcrp.html">
                        <span>Commission documentation, communication et relations publiques</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="mega-menu__col">
                  <ul class="mega-menu__list">
                    <li>
                      <a href="${window.CNDT_SITE.root}rhcaj.html">
                        <span>Commission des ressources humaines, de la coopération et des affaires juridiques</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}ct.html">
                        <span>Commission technique</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}personnel.html">
                        <span>Catalogue du personnel</span>
                      </a>
                    </li>
                    <li>
                      <a href="${window.CNDT_SITE.root}galerie.html">
                        <span>Galerie photo</span>
                      </a>
                    </li>
                  </ul>
                </div>

              </div>

              <div class="mega-menu__foot">
                <a class="mega-menu__cta" href="${window.CNDT_SITE.root}organigramme.html">
                  Voir l'organigramme complet
                  <span aria-hidden="true">→</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</header>`;

    // Lien actif de la navbar (selon le fichier courant)
    const page = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.primary-nav > a').forEach((link) => {
      const target = (link.getAttribute('href') || '').split('/').pop();
      if (target === page) link.classList.add('active');
    });

    // Pages organisation -> déclencheur « Secrétariats Permanents » actif
    const ORG_PAGES = ['organigramme.html', 'comite.html', 'cabinet.html', 'crmp.html',
                       'cdcrp.html', 'rhcaj.html', 'caaf.html', 'ct.html', 'personnel.html'];
    if (ORG_PAGES.includes(page)) {
      document.querySelector('.primary-nav__trigger')?.classList.add('active');
    }
  }

  /* ---------- Template du footer ---------- */
  if (footer) {
    footer.outerHTML = `
<footer id="contact" class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="${window.CNDT_SITE.root}assets/logo-cndt.webp" alt="CNDT" width="120" height="97" loading="lazy">
      <p>Comité National de Développement des Technologies</p>
    </div>
    <div>
      <h2>Coordonnées</h2>
      <address>Centre administratif, Yaoundé<br>B.P. 1457 Yaoundé</address>
      <a href="tel:+237222222509">(+237) 222 22 25 09</a>
      <a href="mailto:contact@cndtcameroun.cm">contact@cndtcameroun.cm</a>

      <ul class="footer-socials" aria-label="Nos réseaux sociaux">
        <li>
          <a href="https://www.facebook.com/cndtcameroun"
            target="_blank" rel="noopener"
            aria-label="Page Facebook du CNDT"
            class="footer-social footer-social--facebook">
            <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
            <span>Facebook</span>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/channel/UC3OfHkDXBNVGwiI8henjNww"
            target="_blank" rel="noopener"
            aria-label="Chaîne YouTube du CNDT"
            class="footer-social footer-social--youtube">
            <i class="fa-brands fa-youtube" aria-hidden="true"></i>
            <span>YouTube</span>
          </a>
        </li>
      </ul>
    </div>
    <div>
      <h2>Accès rapide</h2>
      <a href="${window.CNDT_SITE.root}index.html#institution">Présentation</a>
      <a href="${window.CNDT_SITE.root}organigramme.html">Organigramme</a>
      <a href="${window.CNDT_SITE.root}contact.html">Contact</a>
      <div>
        <a href="${window.CNDT_SITE.root}actualites.html">Actualités</a>
        <a href="${window.CNDT_SITE.root}publication.html">Publications</a>
      </div>
    </div>
    <div>
      <h2>Institution de tutelle</h2>
      <p>Ministère de la Recherche Scientifique et l’Innovation</p>
      <a class="footer-external" href="https://minresi.gov.cm" target="_blank" rel="noopener">Visiter le MINRESI <span aria-hidden="true">↗</span></a>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© 2026 CNDT Cameroun. Tous droits réservés.</p>
    <p>La technologie au service du développement</p>
  </div>
</footer>`;
  }
})();


document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. GESTION DES MENUS DE NAVIGATION
     ========================================================= */
  
  // Menu Navigation Primaire (.primary-nav / .menu-toggle)
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  const closePrimaryMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      primaryNav.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closePrimaryMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closePrimaryMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closePrimaryMenu();
    });
  }

  /* =========================================================
     2. CARROUSEL HERO PRINCIPAL (.hero)
     ========================================================= */
  const hero = document.querySelector('.hero');
  const heroSlides = [...document.querySelectorAll('.hero-slide')];
  const heroDots = [...document.querySelectorAll('.hero-dot')];
  const heroPrev = document.querySelector('.hero-prev');
  const heroNext = document.querySelector('.hero-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let heroCurrent = 0;
  let heroTimer = null;
  let pointerStartX = 0;

  const showHeroSlide = (index) => {
    if (!heroSlides.length) return;
    heroCurrent = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === heroCurrent;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    heroDots.forEach((dot, dotIndex) => {
      const active = dotIndex === heroCurrent;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  };

  const stopHeroAutoplay = () => {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = null;
  };

  const startHeroAutoplay = () => {
    stopHeroAutoplay();
    if (!reducedMotion && heroSlides.length > 1) {
      heroTimer = setInterval(() => showHeroSlide(heroCurrent + 1), 6500);
    }
  };

  if (hero && heroSlides.length) {
    heroPrev?.addEventListener('click', () => {
      showHeroSlide(heroCurrent - 1);
      startHeroAutoplay();
    });

    heroNext?.addEventListener('click', () => {
      showHeroSlide(heroCurrent + 1);
      startHeroAutoplay();
    });

    heroDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showHeroSlide(index);
        startHeroAutoplay();
      });
    });

    hero.addEventListener('mouseenter', stopHeroAutoplay);
    hero.addEventListener('mouseleave', startHeroAutoplay);
    hero.addEventListener('focusin', stopHeroAutoplay);
    hero.addEventListener('focusout', (event) => {
      if (!hero.contains(event.relatedTarget)) {
        startHeroAutoplay();
      }
    });

    hero.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button, a, .hero-prev, .hero-next, .hero-dot')) return;
      pointerStartX = event.clientX;
    });

    hero.addEventListener('pointerup', (event) => {
      if (event.target.closest('button, a, .hero-prev, .hero-next, .hero-dot')) return;
      const distance = event.clientX - pointerStartX;
      if (Math.abs(distance) < 55) return;
      showHeroSlide(distance > 0 ? heroCurrent - 1 : heroCurrent + 1);
      startHeroAutoplay();
    });

    hero.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showHeroSlide(heroCurrent - 1);
      if (event.key === 'ArrowRight') showHeroSlide(heroCurrent + 1);
    });

    showHeroSlide(0);
    startHeroAutoplay();
  }




  /* =========================================================
     4. FILTRES D'ARCHIVES
     ========================================================= */
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const archiveCards = [...document.querySelectorAll('[data-category]')];

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      archiveCards.forEach((card) => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });


  /* =========================================================
     5. PANNEAUX SECRÉTARIAT / ACCORDÉONS
     ========================================================= */
  const secretariatPanels = [...document.querySelectorAll('.secretariat-panel')];

  const openSecretariatFromHash = () => {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    try {
      const panel = document.querySelector(hash);
      if (panel?.classList.contains('secretariat-panel')) {
        panel.open = true;
      }
    } catch (e) {
      // Ignorer si le hash n'est pas un sélecteur valide
    }
  };

  secretariatPanels.forEach((panel) => {
    panel.addEventListener('toggle', () => {
      if (!panel.open) return;
      secretariatPanels.forEach((item) => {
        if (item !== panel) item.open = false;
      });
    });
  });

  window.addEventListener('hashchange', openSecretariatFromHash);
  openSecretariatFromHash();


  /* =========================================================
     6. CARROUSEL SWIPER (INSTITUTS)
     ========================================================= */
  const institutsContainer = document.querySelector('.instituts-carousel');

  if (institutsContainer && typeof Swiper !== 'undefined') {
    new Swiper('.instituts-carousel', {
      slidesPerView: 2,
      spaceBetween: 16,
      loop: true,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.instituts-carousel .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.instituts-carousel .swiper-button-next',
        prevEl: '.instituts-carousel .swiper-button-prev',
      },
      breakpoints: {
        480: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 24 },
        1024: { slidesPerView: 6, spaceBetween: 24 },
      },
    });
  }




  /* =========================================================
     7. ORGANIGRAMME — rendu depuis window.CNDT_ORG
     =========================================================
     Alimenté par organisation-data.js (structure réelle du site).
     Rendu si la page contient [data-org-tree].
     ========================================================= */
  (() => {
    const mount = document.querySelector('[data-org-tree]');
    if (!mount || !window.CNDT_ORG) return;

    const root = window.CNDT_SITE.root;
    const esc = (str) =>
      String(str).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    /* ---------- Une unité (lien ou libellé) ---------- */
    const unitItem = (unit) => {
      const label = `<strong>${esc(unit.label)}</strong>`;
      const code = unit.code ? `<span class="org-tree__code">${esc(unit.code)}</span>` : '';
      const body = unit.url
        ? `<a href="${root}${esc(unit.url)}">${code}${label}</a>`
        : `<p>${code}${label}</p>`;

      if (unit.children && unit.children.length) {
        return `
          <li class="org-tree__unit" id="${esc(unit.id)}">
            ${body}
            <ul class="org-tree__sub">
              ${unit.children.map(unitItem).join('')}
            </ul>
          </li>`;
      }
      return `<li class="org-tree__unit" id="${esc(unit.id)}">${body}</li>`;
    };

    /* ---------- Un chapitre ---------- */
    const chapterBlock = (chapter) => {
      const head = chapter.url
        ? `<a class="org-tree__chapter-head" href="${root}${esc(chapter.url)}">
             <span class="org-tree__code">${esc(chapter.code)}</span>
             <strong>${esc(chapter.label)}</strong>
             <i aria-hidden="true">→</i>
           </a>`
        : `<p class="org-tree__chapter-head">
             <span class="org-tree__code">${esc(chapter.code)}</span>
             <strong>${esc(chapter.label)}</strong>
           </p>`;

      const units = (chapter.units || []).map(unitItem).join('');

      return `
        <section class="org-tree__chapter" id="${esc(chapter.id)}">
          ${head}
          <ul class="org-tree__units">${units}</ul>
        </section>`;
    };

    /* ---------- Assemblage ---------- */
    mount.innerHTML = `
      <div class="org-tree">
        <a class="org-tree__root" href="${root}comite.html">
          <span class="org-tree__code">CNDT</span>
          <strong>Comité National de Développement des Technologies</strong>
          <small>Secrétariat Permanent</small>
        </a>
        <div class="org-tree__chapters">
          ${window.CNDT_ORG.chapters.map(chapterBlock).join('')}
        </div>
      </div>`;
  })();

    /* =========================================================
     12. BARRE DE RECHERCHE NAVBAR
     =========================================================
     - Index statique des pages principales du site
     - Recherche instantanée (nom, mots-clés)
     - Navigation clavier (↑ ↓ Entrée Échap)
     - Surlignage du terme trouvé
     ========================================================= */
  const navSearch = document.querySelector('[data-nav-search]');

  if (navSearch) {
    const input   = navSearch.querySelector('[data-nav-search-input]');
    const clearBtn= navSearch.querySelector('[data-nav-search-clear]');
    const results = navSearch.querySelector('[data-nav-search-results]');

    /* ---------- Index du site ----------
       Les chemins sont RELATIFS À LA RACINE du site.
       Le préfixe (sous-dossier éventuel) est ajouté au rendu via BASE. */
    const BASE = window.CNDT_SITE.root;

    const SEARCH_INDEX = [
      /* --- Pages principales --- */
      { title: "Accueil",                    url: "index.html",
        group: "Pages", excerpt: "Présentation institutionnelle du CNDT",
        keywords: "accueil cndt comité technologie cameroun" },

      { title: "Organigramme",               url: "organigramme.html",
        group: "Pages", excerpt: "Structure et organisation du CNDT",
        keywords: "organigramme organisation structure hiérarchie chapitres" },

      { title: "Personnel",                  url: "personnel.html",
        group: "Pages", excerpt: "Annuaire du personnel par niveau hiérarchique",
        keywords: "personnel équipe staff membres annuaire" },

      { title: "Actualités",                 url: "actualites.html",
        group: "Pages", excerpt: "Événements, rencontres et activités du CNDT",
        keywords: "actualités news événements rencontres communiqués" },

      { title: "Publications",               url: "publication.html",
        group: "Pages", excerpt: "Rapports, actes et documents scientifiques",
        keywords: "publications documents rapports technomag médias" },

      { title: "Galerie photo",              url: "galerie.html",
        group: "Pages", excerpt: "Albums photos des activités du CNDT",
        keywords: "galerie photos albums images" },

      { title: "Contact",                    url: "contact.html",
        group: "Pages", excerpt: "Coordonnées et formulaire de contact",
        keywords: "contact email téléphone adresse formulaire" },

      /* --- Organisation --- */
      { title: "Comité du CNDT",             url: "comite.html",
        group: "Organisation", excerpt: "Le Comité national et ses membres",
        keywords: "comité membres session ministère" },

      { title: "Cabinet du Secrétaire Permanent", url: "cabinet.html",
        group: "Organisation", excerpt: "Chapitre I — 7 cellules rattachées au SP",
        keywords: "cabinet secrétaire permanent chapitre" },

      { title: "Commission Recherche & Management des Projets", url: "crmp.html",
        group: "Organisation", excerpt: "Recherche, projets et secrétariats techniques",
        keywords: "recherche management projets commission" },

      { title: "Commission Documentation, Communication & Relations Publiques", url: "cdcrp.html",
        group: "Organisation", excerpt: "Documentation, communication et relations publiques",
        keywords: "documentation communication relations publiques archives" },

      { title: "Commission RH, Coopération & Affaires Juridiques", url: "rhcaj.html",
        group: "Organisation", excerpt: "Ressources humaines, coopération et juridique",
        keywords: "ressources humaines coopération juridique contentieux" },

      { title: "Commission des Affaires Administratives & Financières", url: "caaf.html",
        group: "Organisation", excerpt: "Affaires administratives, financières et engagements",
        keywords: "affaires administratives financières engagements budget" },

      { title: "Commission Technique",       url: "ct.html",
        group: "Organisation", excerpt: "Les cinq secrétariats techniques du CNDT",
        keywords: "technique tic ia industrie biosciences énergie mines politiques" },
    ];

    /* ---------- Normalisation ---------- */
    const normalize = (str) =>
      (str || "").toString().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    // Pré-calcul des index normalisés
    SEARCH_INDEX.forEach((item) => {
      item._index = normalize(`${item.title} ${item.excerpt} ${item.keywords}`);
    });

    /* ---------- Échappement HTML ---------- */
    const escapeHtml = (str) =>
      str.replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      }[c]));

    /* ---------- Surlignage du terme trouvé ---------- */
    const highlight = (text, tokens) => {
      let safe = escapeHtml(text);
      tokens.forEach((t) => {
        if (t.length < 2) return;
        const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        safe = safe.replace(re, "<mark>$1</mark>");
      });
      return safe;
    };

    /* ---------- Recherche ---------- */
    const search = (rawTerm) => {
      const term = normalize(rawTerm);
      if (!term) return [];
      const tokens = term.split(/\s+/);

      return SEARCH_INDEX
        .map((item) => {
          const idx = item._index;
          let score = 0;
          tokens.forEach((t) => {
            if (idx.includes(t)) {
              score += 1;
              if (normalize(item.title).includes(t)) score += 2; // bonus titre
            }
          });
          return { item, score, matchesAll: tokens.every((t) => idx.includes(t)) };
        })
        .filter((r) => r.matchesAll && r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((r) => ({ ...r.item, _tokens: tokens }));
    };

    /* ---------- Rendu des résultats ---------- */
    let currentActive = -1;

    const renderResults = (results, term) => {
      currentActive = -1;

      if (!term) {
        results.hidden = true;
        input.setAttribute("aria-expanded", "false");
        return;
      }

      if (!results.length) {
        results.innerHTML = `
          <div class="nav-search__empty">
            <strong>Aucun résultat</strong>
            Aucune page ne correspond à « ${escapeHtml(term)} ».
          </div>
          <div class="nav-search__hint">
            <span>Essayez un autre mot-clé</span>
          </div>`;
        results.hidden = false;
        input.setAttribute("aria-expanded", "true");
        return;
      }

      // Regroupement par catégorie
      const grouped = results.reduce((acc, item) => {
        (acc[item.group] = acc[item.group] || []).push(item);
        return acc;
      }, {});

      let html = "";
      Object.entries(grouped).forEach(([group, items]) => {
        html += `<div class="nav-search__group">${escapeHtml(group)}</div>`;
        items.forEach((item) => {
          html += `
            <a class="nav-search__item"
               href="${BASE}${item.url}"
               role="option"
               data-nav-search-item>
              <strong>${highlight(item.title, item._tokens)}</strong>
              <span>${highlight(item.excerpt, item._tokens)}</span>
            </a>`;
        });
      });

      html += `
        <div class="nav-search__hint">
          <span><kbd>↑</kbd> <kbd>↓</kbd> pour naviguer</span>
          <span><kbd>Entrée</kbd> pour ouvrir</span>
        </div>`;

      results.innerHTML = html;
      results.hidden = false;
      input.setAttribute("aria-expanded", "true");
    };

    /* ---------- Debounce ---------- */
    let searchTimer = null;
    const handleInput = () => {
      if (searchTimer) clearTimeout(searchTimer);
      const value = input.value;

      clearBtn.hidden = value.length === 0;

      searchTimer = setTimeout(() => {
        const resultsList = search(value);
        renderResults(resultsList, value.trim());
      }, 90);
    };

    /* ---------- Événements ---------- */
    input.addEventListener("input", handleInput);
    input.addEventListener("focus", () => {
      if (input.value.trim()) handleInput();
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      clearBtn.hidden = true;
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.focus();
    });

    /* ---------- Navigation clavier ---------- */
    input.addEventListener("keydown", (e) => {
      const items = [...results.querySelectorAll("[data-nav-search-item]")];
      if (!items.length) {
        if (e.key === "Escape") {
          input.value = "";
          clearBtn.hidden = true;
          results.hidden = true;
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentActive = (currentActive + 1) % items.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentActive = (currentActive - 1 + items.length) % items.length;
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentActive >= 0) items[currentActive].click();
        return;
      } else if (e.key === "Escape") {
        input.value = "";
        clearBtn.hidden = true;
        results.hidden = true;
        input.setAttribute("aria-expanded", "false");
        return;
      } else {
        return;
      }

      items.forEach((el, i) => el.classList.toggle("is-active", i === currentActive));
      items[currentActive]?.scrollIntoView({ block: "nearest" });
    });

    /* ---------- Fermer au clic extérieur ---------- */
    document.addEventListener("click", (e) => {
      if (!navSearch.contains(e.target)) {
        results.hidden = true;
        input.setAttribute("aria-expanded", "false");
      }
    });

    /* ---------- Raccourci clavier « / » ---------- */
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
      }
    });
  }

    /* =========================================================
     13. FORMULAIRE DE CONTACT
     ========================================================= */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const feedback = contactForm.querySelector('[data-contact-feedback]');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(contactForm);
      const required = ['name', 'email', 'subject', 'message'];
      const missing = required.filter((name) => !String(data.get(name) || '').trim());

      if (missing.length) {
        showFeedback('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }

      const email = String(data.get('email') || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback('Veuillez saisir une adresse email valide.', 'error');
        return;
      }

      if (!data.get('consent')) {
        showFeedback('Veuillez accepter la clause de confidentialité.', 'error');
        return;
      }

      /* Démo locale : à remplacer par un POST vers votre backend ou service d'envoi
         (Formspree, EmailJS, API maison…) */
      showFeedback('Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 48 h.', 'success');
      contactForm.reset();
    });

    function showFeedback(message, type) {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.remove('is-success', 'is-error');
      feedback.classList.add(type === 'success' ? 'is-success' : 'is-error');
      feedback.hidden = false;

      setTimeout(() => {
        if (type === 'success') feedback.hidden = true;
      }, 8000);
    }
  }

  

});


/* =========================================================
    14. MEGA-MENU — ouverture / fermeture
    ========================================================= */
const megaTrigger = document.querySelector('[data-mega-trigger]');
const megaMenu    = document.querySelector('[data-mega-menu]');
const megaClose   = document.querySelector('[data-mega-close]');

if (megaTrigger && megaMenu) {
  const isMobile = () => window.innerWidth <= 860;

  const openMega = () => {
    megaTrigger.setAttribute('aria-expanded', 'true');
    megaMenu.classList.add('is-open');
    megaMenu.setAttribute('aria-hidden', 'false');
  };

  const closeMega = () => {
    megaTrigger.setAttribute('aria-expanded', 'false');
    megaMenu.classList.remove('is-open');
    megaMenu.setAttribute('aria-hidden', 'true');
  };

  const toggleMega = () => {
    const isOpen = megaTrigger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMega() : openMega();
  };

  // Clic sur le trigger
  megaTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMega();
  });

  // Bouton « Fermer » dans le panneau
  megaClose?.addEventListener('click', () => {
    closeMega();
    megaTrigger.focus();
  });

  // Échap ferme le mega-menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaMenu.classList.contains('is-open')) {
      closeMega();
      megaTrigger.focus();
    }
  });

  // Clic extérieur : ferme le panneau (desktop uniquement)
  document.addEventListener('click', (e) => {
    if (isMobile()) return;
    if (!megaMenu.classList.contains('is-open')) return;
    if (megaMenu.contains(e.target) || megaTrigger.contains(e.target)) return;
    closeMega();
  });

  // Fermeture au clic sur le fond (backdrop) — mobile uniquement
  megaMenu.addEventListener('click', (e) => {
    if (!isMobile()) return;
    if (e.target === megaMenu) closeMega();
  });

  // Clic sur un lien du mega-menu → ferme le panneau
  megaMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobile()) {
        // Sur mobile, le lien navigue normalement, mais on referme le menu coulissant
        closeMega();
        if (typeof closePrimaryMenu === 'function') closePrimaryMenu();
      } else {
        closeMega();
      }
    });
  });

  // Réinitialisation au redimensionnement
  window.addEventListener('resize', () => {
    // Si on passe de mobile à desktop (ou inversement) avec le menu ouvert, on ferme
    if (megaMenu.classList.contains('is-open')) {
      closeMega();
    }
  });
}



/* =========================================================
   Font Awesome — injection du CDN si absent
   (les icônes des réseaux sociaux sont déjà dans le template
   du header, section 0)
   ========================================================= */
(() => {
  const FA_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  if (!document.querySelector(`link[href="${FA_URL}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FA_URL;
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);
  }
})();



/* =========================================================
   GALERIE PHOTO — Navigation albums + Lightbox
   Aucune donnée : tout est lu depuis le HTML
   ========================================================= */
(() => {
  const viewAlbums = document.querySelector('[data-gallery-view="albums"]');
  const albumViews = [...document.querySelectorAll('[data-album-view]')];
  const openButtons = [...document.querySelectorAll('[data-album-open]')];
  const backButtons = [...document.querySelectorAll('[data-album-back]')];

  if (!viewAlbums || !albumViews.length) return;   // pas la page galerie

  /* ---------- Références lightbox ---------- */
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = lightbox.querySelector('[data-lb-img]');
  const lbCaption  = lightbox.querySelector('[data-lb-caption]');
  const lbIndex    = lightbox.querySelector('[data-lb-index]');
  const lbTotal    = lightbox.querySelector('[data-lb-total]');
  const lbThumbs   = lightbox.querySelector('[data-lb-thumbs]');
  const lbClose    = lightbox.querySelector('[data-lb-close]');
  const lbPrev     = lightbox.querySelector('[data-lb-prev]');
  const lbNext     = lightbox.querySelector('[data-lb-next]');

  let currentPhotos = [];   // [{ src, caption }]
  let currentIndex  = 0;

  /* =========================================================
     1. Navigation entre albums et liste
     ========================================================= */
  const showAlbums = () => {
    viewAlbums.hidden = false;
    albumViews.forEach((v) => (v.hidden = true));
    history.replaceState({}, '', location.pathname);
  };

  const showAlbum = (id) => {
    const target = document.querySelector(`[data-album-view="${id}"]`);
    if (!target) return;

    viewAlbums.hidden = true;
    albumViews.forEach((v) => (v.hidden = v !== target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ albumId: id }, '', `?album=${id}`);
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => showAlbum(btn.dataset.albumOpen));
  });

  backButtons.forEach((btn) => {
    btn.addEventListener('click', showAlbums);
  });

  // Support du bouton retour du navigateur
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.albumId) showAlbum(e.state.albumId);
    else showAlbums();
  });

  // Ouverture directe via URL ?album=…
  const params = new URLSearchParams(location.search);
  if (params.get('album')) setTimeout(() => showAlbum(params.get('album')), 50);

  /* =========================================================
     2. Ouverture de la lightbox à partir d'une photo
     ========================================================= */
  function openLightbox(photos, startIndex) {
    currentPhotos = photos;
    currentIndex = startIndex;
    updateLightbox();
    buildThumbs();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  function gotoPhoto(index) {
    const total = currentPhotos.length;
    currentIndex = (index + total) % total;
    updateLightbox();
    updateThumbActive();
  }

  function updateLightbox() {
    const photo = currentPhotos[currentIndex];
    lbImg.src = photo.src;
    lbImg.alt = photo.caption || `Photo ${currentIndex + 1}`;

    if (photo.caption) {
      lbCaption.textContent = photo.caption;
      lbCaption.hidden = false;
    } else {
      lbCaption.hidden = true;
    }

    lbIndex.textContent = currentIndex + 1;
    lbTotal.textContent = currentPhotos.length;
  }

  function buildThumbs() {
    lbThumbs.innerHTML = currentPhotos.map((photo, i) => `
      <button type="button" class="lightbox__thumb ${i === currentIndex ? 'is-current' : ''}"
              data-thumb-index="${i}"
              aria-label="Voir la photo ${i + 1}">
        <img src="${photo.src}" alt="" loading="lazy">
      </button>
    `).join('');

    lbThumbs.querySelectorAll('[data-thumb-index]').forEach((btn) => {
      btn.addEventListener('click', () => gotoPhoto(Number(btn.dataset.thumbIndex)));
    });

    const active = lbThumbs.querySelector('.lightbox__thumb.is-current');
    active?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function updateThumbActive() {
    lbThumbs.querySelectorAll('.lightbox__thumb').forEach((btn, i) => {
      btn.classList.toggle('is-current', i === currentIndex);
    });
    const active = lbThumbs.querySelector('.lightbox__thumb.is-current');
    active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  /* =========================================================
     3. Branchement de toutes les photos de tous les albums
     ========================================================= */
  albumViews.forEach((albumView) => {
    // Récupère toutes les photos de cet album (dans l'ordre du DOM)
    const photoButtons = [...albumView.querySelectorAll('.gallery-photo')];
    const photos = photoButtons.map((btn) => ({
      src: btn.dataset.photoSrc,
      caption: btn.dataset.photoCaption || '',
    }));

    photoButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => openLightbox(photos, index));
    });
  });

  /* =========================================================
     4. Contrôles de la lightbox
     ========================================================= */
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => gotoPhoto(currentIndex - 1));
  lbNext?.addEventListener('click', () => gotoPhoto(currentIndex + 1));

  // Clic sur le fond noir → fermer
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Clavier : Échap + flèches
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  gotoPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') gotoPhoto(currentIndex + 1);
  });

  // Swipe tactile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) < 60) return;
    gotoPhoto(diff > 0 ? currentIndex - 1 : currentIndex + 1);
  });
})();