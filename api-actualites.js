/* ============================================================
   api-actualites.js — rendu dynamique des actualités (site public)
   ------------------------------------------------------------
   Consomme l'API Laravel (GET /api/v1/articles) et alimente :
     1. [data-actualites-grid]  : liste complète + filtres + "Charger plus"
        (page actualites.html)
     2. [data-news-list]        : derniers titres (widget accueil index.html)
     3. [data-article-detail]   : page d'un article (?slug=…)
        (page actualite/article.html)

   À inclure APRÈS app.js :
     <script defer src="api-actualites.js"></script>
   ============================================================ */

window.CNDT_API = window.CNDT_API || {
  url: 'http://127.0.0.1:8000/api/v1',
};

(() => {
  'use strict';

  const API = window.CNDT_API.url;
  const CATEGORY_LABELS = { ia: 'IA', evenement: 'Événements', formation: 'Formation', all: 'Toutes' };
  const PER_PAGE = 6;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const esc = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  async function fetchApi(path) {
    const res = await fetch(API + path, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('API indisponible (' + res.status + ')');
    return res.json();
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function articleLink(slug) {
    // Depuis le sous-dossier actualite/ les liens sont locaux, depuis la racine
    // ils passent par le sous-dossier.
    const inArticleFolder = /\/actualite\/[^/]*\.html/.test(location.pathname);
    const prefix = inArticleFolder ? 'article.html?slug=' : 'actualite/article.html?slug=';
    return prefix + encodeURIComponent(slug);
  }

  function cardHtml(article) {
    const img = article.cover_image
      ? `<div class="archive-image"><img src="${esc(article.cover_image)}" alt="${esc(article.title)}" loading="lazy"></div>`
      : '<div class="archive-image"></div>';
    const cat = article.category || 'evenement';

    return `
      <article class="archive-card" data-category="${esc(cat)}" data-slug="${esc(article.slug)}">
        ${img}
        <div class="archive-body">
          <div class="archive-meta">
            <time datetime="${esc((article.published_at || '').slice(0, 10))}">${esc(formatDate(article.published_at))}</time>
            <span>${esc(CATEGORY_LABELS[cat] || cat)}</span>
          </div>
          <h2>${esc(article.title)}</h2>
          <p>${esc(article.excerpt || '')}</p>
          <a class="text-link" href="${articleLink(article.slug)}">Lire l'actualité <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
  }

  /* ---------- 1. Liste complète (actualites.html) ---------- */
  async function renderActualitesGrid() {
    const grid = $('[data-actualites-grid]');
    if (!grid) return;

    const state = { page: 1, filter: 'all', loading: false, hasMore: true };
    const activeFilter = () =>
      $('[data-actualites-filter] .is-active')?.dataset.filter || 'all';

    // Filtres : les boutons existants de la page (data-filter)
    $$('[data-actualites-filter] [data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('[data-actualites-filter] [data-filter]').forEach((b) =>
          b.classList.toggle('is-active', b === btn));
        state.filter = btn.dataset.filter;
        state.page = 1;
        load(true);
      });
    });

    async function load(reset) {
      if (state.loading || (reset === false && !state.hasMore)) return;
      state.loading = true;

      const more = $('#actualites-more');
      if (reset) grid.innerHTML = '<p class="archive-empty">Chargement des actualités…</p>';

      try {
        const params = new URLSearchParams({ page: state.page, per_page: PER_PAGE });
        if (state.filter !== 'all') params.set('category', state.filter);
        const res = await fetchApi('/articles?' + params.toString());
        const items = res.data || [];
        state.hasMore = !!res.links?.next;
        state.page += 1;

        if (reset) grid.innerHTML = '';
        if (!items.length && reset) {
          grid.innerHTML = '<p class="archive-empty">Aucune actualité publiée pour le moment.</p>';
        }
        items.forEach((a) => {
          grid.insertAdjacentHTML('beforeend', cardHtml(a));
        });

        if (more) more.hidden = !state.hasMore;
      } catch (err) {
        if (reset) grid.innerHTML =
          `<p class="archive-error">Impossible de charger les actualités (${esc(err.message)}).`;
      } finally {
        state.loading = false;
      }
    }

    // Bouton « Charger plus »
    const more = $('#actualites-more');
    if (more) {
      more.addEventListener('click', () => load(false));
    }

    await load(true);
  }

  /* ---------- 2. Derniers titres (index.html) ---------- */
  async function renderNewsList() {
    const list = $('[data-news-list]');
    if (!list) return;

    try {
      const res = await fetchApi('/articles?per_page=5');
      const items = res.data || [];
      if (!items.length) {
        list.innerHTML = '<p>Aucune actualité pour le moment.</p>';
        return;
      }
      list.innerHTML = items.map((a) => {
        const d = a.published_at ? new Date(a.published_at) : new Date();
        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
        const dow = d.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase();
        const year = d.getFullYear();
        const iso = (a.published_at || '').slice(0, 10);
        return `
          <a href="${articleLink(a.slug)}">
            <time datetime="${esc(iso)}"><small>${esc(dow)}</small><strong>${esc(day)}</strong><span>${esc(month)}<br>${year}</span></time>
            <p>${esc(a.title)}</p>
          </a>`;
      }).join('');
    } catch (err) {
      // Le widget garde son contenu statique en cas d'indisponibilité
      console.warn('Actualités dynamiques indisponibles :', err.message);
    }
  }

  /* ---------- 3. Page article (actualite/article.html) ---------- */
  async function renderArticleDetail() {
    const root = $('[data-article-detail]');
    if (!root) return;

    const slug = new URLSearchParams(location.search).get('slug');
    const hero = $('[data-article-hero]', root);
    const body = $('[data-article-body]', root);

    if (!slug) {
      if (body) body.innerHTML =
        '<p class="archive-error">Aucun article demandé. <a class="text-link" href="../actualites.html">Voir toutes les actualités</a></p>';
      if (hero) hero.hidden = true;
      return;
    }

    try {
      const res = await fetchApi('/articles/' + encodeURIComponent(slug));
      const a = res.data;
      document.title = `${a.title} | CNDT Cameroun`;

      if (hero) {
        const img = $('img', hero);
        if (img && a.cover_image) {
          // cover_image est relative à la racine du site ; la page est dans un sous-dossier
          img.src = /^(https?:)?\//.test(a.cover_image)
            ? a.cover_image
            : '../' + a.cover_image;
          img.alt = a.title;
        }
        const h1 = $('h1', hero);
        if (h1) h1.textContent = a.title;
        const time = $('time', hero);
        if (time) {
          time.dateTime = (a.published_at || '').slice(0, 10);
          time.textContent = formatDate(a.published_at);
        }
        const cat = $('[data-article-category]', hero);
        if (cat) cat.textContent = CATEGORY_LABELS[a.category] || a.category || 'Actualité';
      }

      if (body) {
        const content = (a.content || a.excerpt || '');
        if (/<\/?[a-z][\s\S]*>/i.test(content)) {
          // Contenu HTML riche (éditeur WYSIWYG du dashboard)
          body.innerHTML = content;
        } else {
          // Contenu texte brut : paragraphes
          const paragraphs = content.split(/\n\s*\n|\r\n\s*\r\n/)
            .map((p) => p.trim()).filter(Boolean);
          body.innerHTML = paragraphs.length
            ? paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')
            : '<p>(Contenu à venir.)</p>';
        }

        // Badge du créateur de l'article (comme la page d'origine « fracture numérique »)
        if (a.author_name) {
          const imgSrc2 = (p) => /^(https?:)?\//.test(p) ? p : '../' + p;
          const badge = document.createElement('a');
          badge.className = 'author-badge';
          badge.href = a.author_url ? (/^(https?:)?\//.test(a.author_url) ? a.author_url : '../' + a.author_url) : '#actualite';
          badge.innerHTML = `
            ${a.author_photo ? `<img src="${esc(imgSrc2(a.author_photo))}" alt="Portrait de ${esc(a.author_name)}" loading="lazy">` : ''}
            <span class="author-badge__body">
              <span class="author-badge__label">Rédigé par</span>
              <strong>${esc(a.author_name)}</strong>
              ${a.author_role ? `<span class="author-badge__role">${esc(a.author_role)}</span>` : ''}
            </span>`;
          body.appendChild(badge);
        }

        // Galerie d'images de l'article (gérées depuis le dashboard)
        // — mêmes classes que les pages d'origine (.project-gallery)
        if (Array.isArray(a.images) && a.images.length) {
          const imgSrc = (p) => /^(https?:)?\//.test(p) ? p : '../' + p;
          const gallerySection = document.createElement('section');
          gallerySection.id = 'galerie';
          gallerySection.className = 'project-section';
          gallerySection.setAttribute('aria-label', "Galerie de l'article");
          gallerySection.innerHTML = `
            <h2>Galerie</h2>
            <div class="project-gallery">
              ${a.images.map((im) => `
                <figure>
                  <img src="${esc(imgSrc(im.path))}" alt="${esc(im.caption || a.title)}">
                  ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ''}
                </figure>`).join('')}
            </div>`;
          body.closest('.project-content')?.appendChild(gallerySection);
        }
      }
    } catch (err) {
      if (body) body.innerHTML =
        `<p class="archive-error">Actualité introuvable ou API indisponible. ` +
        `<a class="text-link" href="../actualites.html">Retour aux actualités</a></p>`;
      if (hero) hero.hidden = true;
    }
  }

  /* ---------- 4. Carrousel des instituts (alimenté par l'API) ---------- */
  async function renderInstituts() {
    const wrapper = $('.instituts-carousel .swiper-wrapper');
    if (!wrapper) return;

    try {
      const res = await fetchApi('/instituts');
      const items = (res.data || []).filter((i) => i.is_visible !== false);
      if (!items.length) return; // garde les slides statiques existants

      // Chemins relatifs : préfixe selon la profondeur de la page
      const prefix = /\/actualite\/[^/]*\.html/.test(location.pathname) ? '../' : '';
      const imgSrc = (p) => /^(https?:)?\//.test(p) ? p : prefix + p;

      wrapper.innerHTML = items.map((i) => `
        <div class="swiper-slide">
          <a href="${esc(i.url || '#')}" target="_blank" rel="noopener noreferrer" class="partner-card">
            <img src="${esc(imgSrc(i.logo))}" alt="${esc(i.name)}" loading="lazy">
          </a>
        </div>`).join('');

      // Swiper fixe la largeur des slides à l'initialisation : les nouveaux
      // slides injectés gardent le width:100% par défaut → recalcul forcé.
      const swiperEl = $('.instituts-carousel');
      if (swiperEl && swiperEl.swiper) {
        swiperEl.swiper.update();
        if (typeof swiperEl.swiper.loopFix === 'function') swiperEl.swiper.loopFix();
      }
    } catch {
      // API indisponible : le carrousel statique d'origine est conservé
    }
  }

  /* ---------- Démarrage ---------- */
  const start = () => {
    renderActualitesGrid();
    renderNewsList();
    renderArticleDetail();
    renderInstituts();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
