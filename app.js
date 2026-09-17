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

  // Menu Navigation Dropdown (.nav__links--container)
  const openNav = document.querySelector('.open-menu');
  const closeNav = document.querySelector('.close-menu');
  const navMenu = document.querySelector('.nav__links--container');
  const background = document.querySelector('.background');
  const mediaSize = 992;

  function toggleNavMenu() {
    if (navMenu) navMenu.classList.toggle('open');
    if (background) background.classList.toggle('active');
  }

  if (openNav) openNav.addEventListener('click', toggleNavMenu);
  if (closeNav) closeNav.addEventListener('click', toggleNavMenu);
  if (background) background.addEventListener('click', toggleNavMenu);

  function collapseDropdownMenu() {
    if (!navMenu) return;
    const activeMenu = navMenu.querySelector('.dropdown__menu--branch.active .dropdown__menu');
    const activeBranch = navMenu.querySelector('.dropdown__menu--branch.active');

    if (activeMenu) activeMenu.removeAttribute('style');
    if (activeBranch) activeBranch.classList.remove('active');
  }

  if (navMenu) {
    navMenu.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-toggle') && window.innerWidth < mediaSize) {
        event.preventDefault();
        const dropdownMenuBranch = event.target.parentElement;

        if (dropdownMenuBranch && dropdownMenuBranch.classList.contains('active')) {
          collapseDropdownMenu();
        } else if (dropdownMenuBranch) {
          collapseDropdownMenu();
          dropdownMenuBranch.classList.add('active');
          const dropdownMenu = dropdownMenuBranch.querySelector('.dropdown__menu');
          if (dropdownMenu) {
            dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + 'px';
          }
        }
      }
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
     3. CARROUSEL SECONDAIRE (.carousel-slide)
     ========================================================= */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (slides.length > 0) {
    let currentIndex = 0;
    let timer = null;

    function gotoSlide(index) {
      if (index >= slides.length) currentIndex = 0;
      else if (index < 0) currentIndex = slides.length - 1;
      else currentIndex = index;

      slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function autoPlay() {
      stopAutoplay();
      if (!reducedMotion && slides.length > 1) {
        timer = setInterval(() => gotoSlide(currentIndex + 1), 5000);
      }
    }

    function resetTimer() {
      stopAutoplay();
      autoPlay();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        gotoSlide(currentIndex + 1);
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        gotoSlide(currentIndex - 1);
        resetTimer();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.dataset.slide, 10);
        if (!isNaN(slideIndex)) {
          gotoSlide(slideIndex);
          resetTimer();
        }
      });
    });

    autoPlay();
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
     7. ORGANIGRAMME INTERACTIF (D3 OrgChart + Liens + PDF)
     ========================================================= */
  const chartContainer = document.querySelector('.chart-container');

  if (chartContainer && typeof d3 !== 'undefined' && typeof d3.OrgChart !== 'undefined') {
    
    // 1. Données avec attribut 'url' sur chaque nœud
    const data = [
      {
        id: "1",
        parentId: "",
        name: "Présidence et membres du Comité",
        position: "Ministre du MINERESI",
        description: "",
        image: "assets/people/ministre.jpg",
        color: "#0f2f1b",
        url: "#"
      },
      {
        id: "2",
        parentId: "1",
        name: "Dr ELE ABIAMA Patrice",
        position: "Secrétaire Permanent du CNDT",
        description: "",
        image: "assets/people/sp.webp",
        color: "#1a5c38",
        url: "secretariat-permanent.html"
      },
      {
        id: "3",
        parentId: "2", 
        name: "Dr TSUANYO David",
        position: "Coordonnateur exécutif adjoint",
        description: "Coordination exécutive",
        image: "assets/people/tsuanyo.webp",
        color: "#fcd116",
        url: "coordination.html#tsuanyo"
      },
      {
        id: "4",
        parentId: "2",
        name: "BILOUNGA Marie Sandrine",
        position: "Coordonnatrice exécutive adjointe",
        description: "Coordination exécutive",
        image: "assets/people/bilounga.webp",
        color: "#fcd116",
        url: "coordination.html#bilounga"
      },
      {
        id: "5",
        parentId: "2",
        name: "ISAOURA Bénite",
        position: "Coordonnatrice exécutive adjointe",
        description: "Coordination exécutive",
        image: "assets/people/isaoura.webp",
        color: "#fcd116",
        url: "coordination.html#isaoura"
      },
      {
        id: "6",
        parentId: "3",
        name: "Secrétariat 01",
        position: "TIC et IA",
        description: "Technologies de l’information, communication et intelligence artificielle",
        color: "#2e7d32",
        url: "#secretariat-1"
      },
      {
        id: "7",
        parentId: "4",
        name: "Secrétariat 02",
        position: "Transformations industrielles",
        description: "Technologies et transformations industrielles",
        color: "#2e7d32",
        url: "#secretariat-2"
      },
      {
        id: "8",
        parentId: "4",
        name: "Secrétariat 03",
        position: "Énergie, mines, environnement",
        description: "Technologies de l’énergie, des mines et de l’environnement",
        color: "#2e7d32",
        url: "#secretariat-3"
      },
      {
        id: "9",
        parentId: "5",
        name: "Secrétariat 04",
        position: "Biosciences",
        description: "Biosciences et technologies agricoles",
        color: "#2e7d32",
        url: "#secretariat-4"
      },
      {
        id: "10",
        parentId: "5",
        name: "Secrétariat 05",
        position: "Politiques S&T",
        description: "Politiques scientifiques et technologiques",
        color: "#2e7d32",
        url: "#secretariat-5"
      }
    ];

    // 2. Initialisation de l'Organigramme avec le thème sombre
    window.chart = new d3.OrgChart()
      .container('.chart-container')
      .data(data)
      .nodeHeight(() => 140)
      .nodeWidth(() => 280)
      .childrenMargin(() => 60)
      .siblingsMargin(() => 40)
      .compact(false)
      .nodeContent(function (d) {
        const color = d.data.color;
        const targetUrl = d.data.url || '#';
        
        // Gestion dynamique de l'image
        const imageHtml = d.data.image && d.data.image.trim() !== ""
          ? `<img src="${d.data.image}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; flex-shrink: 0;" alt="Profile"/>`
          : ``;

        return `
          <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #ffffff; border-top: 5px solid ${color}; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.35); width: ${d.width}px; height: ${d.height}px; padding: 12px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            
            <div style="display: flex; align-items: center; gap: 12px;">
              ${imageHtml}
              <div style="flex: 1; overflow: hidden;">
                <div style="color: ${color}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">${d.data.position}</div>
                <div style="color: #0f172a; font-size: 13px; font-weight: 800; line-height: 1.2; margin-bottom: 3px;">${d.data.name}</div>
                <div style="color: #475467; font-size: 11px; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${d.data.description}</div>
              </div>
            </div>

            <!-- Lien vers le profil / la page dédiée -->
            <div style="display: flex; justify-content: flex-end; border-top: 1px solid #f1f5f9; padding-top: 6px;">
              <a href="${targetUrl}" onclick="event.stopPropagation();" style="font-size: 11px; font-weight: 700; color: ${color}; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                En savoir plus ➔
              </a>
            </div>

            <!-- Badge du nombre de subordonnés -->
            ${d.data._directSubordinates > 0 ? `
              <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 2px 8px; font-size: 10px; font-weight: bold; color: #0f172a; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                ${d.data._directSubordinates} ▾
              </div>
            ` : ""}
          </div>
        `;
      })
      // 🟢 Couleur des lignes de liaison adaptées au fond sombre
      .linkUpdate(function (d, i, arr) {
        d3.select(this)
          .attr("stroke", "#22c55e")      // Vert émeraude lumineux pour être très lisible
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.7);
      })
      .render();

    window.chart.expandAll();
    window.chart.fit();

    // 3. Actions des boutons Zoom / Out / Fit
    document.querySelector('[data-chart-action="zoom-in"]')?.addEventListener('click', () => window.chart?.zoomIn());
    document.querySelector('[data-chart-action="zoom-out"]')?.addEventListener('click', () => window.chart?.zoomOut());
    document.querySelector('[data-chart-action="fit"]')?.addEventListener('click', () => window.chart?.fit());


    // document.querySelector('[data-chart-action="export-pdf"]')?.addEventListener('click', () => {
    //   if (!window.chart) return;

    //   // Exporter directement au format PNG puis convertir en PDF
    //   window.chart.exportImg({
    //     full: true,
    //     scale: 2, // Améliore la résolution du rendu
    //     onLoad: (base64) => {
    //       if (window.jspdf && window.jspdf.jsPDF) {
    //         const { jsPDF } = window.jspdf;
    //         const pdf = new jsPDF('l', 'mm', 'a4');
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = pdf.internal.pageSize.getHeight();
            
    //         pdf.addImage(base64, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //         pdf.save('organigramme-cndt.pdf');
    //       } else {
    //         // Fallback si jsPDF n'est pas disponible : télécharge directement l'image PNG
    //         const link = document.createElement('a');
    //         link.download = 'organigramme-cndt.png';
    //         link.href = base64;
    //         link.click();
    //       }
    //     }
    //   });
    // });
  }

  /* =========================================================
   11. ORGANIGRAMME — rendu automatique des pages organisation
   ========================================================= */
const renderOrgPage = () => {
  const currentId = document.body.dataset.orgCurrent;
  if (!currentId || !window.CNDT_ORG) return;

  // Aplatir l'arbre pour retrouver chaque nœud + son chemin
  const flat = [];
  const walk = (node, parents = []) => {
    const path = [...parents, node];
    flat.push({ node, path });
    (node.children || []).forEach((child) => walk(child, path));
  };
  window.CNDT_ORG.chapters.forEach((ch) => {
    walk(ch, [window.CNDT_ORG.root]);
    (ch.units || []).forEach((u) => walk(u, [window.CNDT_ORG.root, ch]));
  });

  const found = flat.find((item) => item.node.id === currentId);
  if (!found) return;
  const { node, path } = found;

  /* ---------- Breadcrumb ---------- */
  const bc = document.querySelector('[data-org-breadcrumb]');
  if (bc) {
    bc.innerHTML = path
      .map((n, i) => {
        const isLast = i === path.length - 1;
        const label = n.label || n.code || '';
        return isLast
          ? `<span aria-current="page">${label}</span>`
          : `<a href="${n.url}">${label}</a><span aria-hidden="true">›</span>`;
      })
      .join('');
  }

  /* ---------- Sidebar : 3 chapitres + unités du chapitre courant ---------- */
  const sb = document.querySelector('[data-org-sidebar]');
  if (sb) {
    const chapter = path.find((p) => p.code && /^[IVX]+$/.test(p.code));

    sb.innerHTML = `
      <p class="project-toc__title">Organisation</p>
      <nav class="project-toc__nav">
        <ol>
          ${window.CNDT_ORG.chapters
            .map((ch) => {
              const isCurrentChapter = chapter && chapter.id === ch.id;
              const unitList = (ch.units || [])
                .map((u) => {
                  if (u.children && u.children.length) {
                    return `
                      <li>
                        <a href="${u.url || '#'}">${u.label}</a>
                        <ol>
                          ${u.children
                            .map((c) =>
                              c.children && c.children.length
                                ? `<li>
                                     <a href="${c.url || '#'}">${c.label}</a>
                                     <ol>
                                       ${c.children
                                         .map((cc) =>
                                           `<li><a href="${cc.url}">${cc.label}</a></li>`
                                         )
                                         .join('')}
                                     </ol>
                                   </li>`
                                : `<li><a href="${c.url}">${c.label}</a></li>`
                            )
                            .join('')}
                        </ol>
                      </li>`;
                  }
                  return `<li><a href="${u.url}">${u.label}</a></li>`;
                })
                .join('');

              return `
                <li>
                  <a href="${ch.url}" class="${isCurrentChapter ? 'is-active' : ''}">${ch.label}</a>
                  ${isCurrentChapter ? `<ol>${unitList}</ol>` : ''}
                </li>`;
            })
            .join('')}
        </ol>
      </nav>
    `;
  }

  /* ---------- Frères (même niveau, même parent) ---------- */
  const sib = document.querySelector('[data-org-siblings]');
  if (sib && path.length > 1) {
    const parent = path[path.length - 2];
    const siblings = parent.children || parent.units || [];
    if (siblings.length > 1) {
      sib.innerHTML = `
        <div class="block-heading heading-row">
          <div>
            <p>Explorer</p>
            <h2 class="secretariats-title">Autres unités — ${parent.label}</h2>
          </div>
        </div>
        <div class="secretariat-list">
          ${siblings
            .filter((s) => s.id !== currentId && s.url)
            .map((s) => `<a href="${s.url}"><span>${s.code || '—'}</span><strong>${s.label}</strong><i aria-hidden="true">↗</i></a>`)
            .join('')}
        </div>
      `;
    }
  }

  /* ---------- Titre + kicker ---------- */
  const t = document.querySelector('[data-org-title]');
  if (t) t.textContent = `${node.label} | CNDT Cameroun`;
  const k = document.querySelector('[data-org-kicker]');
  if (k && node.code) k.textContent = `${node.code} · ${path[1]?.label || ''}`;
};

document.addEventListener('DOMContentLoaded', renderOrgPage);

});


