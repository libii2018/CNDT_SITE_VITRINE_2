# Structure du projet — Vitrine CNDT

Site statique (HTML/CSS/JS purs, aucun build). Déploiement : copier le dossier tel quel.

## Arborescence

```
vitrine CNDT/
│
├── index.html              Accueil (hero, carrousels, instituts)
├── organigramme.html       Organigramme (rendu JS depuis organisation-data.js)
├── comite.html             Comité du CNDT
├── cabinet.html            Chapitre I — Cabinet du Secrétaire Permanent
├── crmp.html               Commission Recherche & Management des Projets
├── cdcrp.html              Commission Documentation, Communication & Relations Publiques
├── rhcaj.html              Commission RH, Coopération & Affaires Juridiques
├── caaf.html               Commission des Affaires Administratives & Financières
├── ct.html                 Commission Technique (5 secrétariats techniques)
├── personnel.html          Catalogue du personnel
├── actualites.html         Liste des actualités
├── publication.html        Publications et médias
├── galerie.html            Galerie photo (albums + lightbox)
├── contact.html            Contact (formulaire démo)
│
├── membres/                Fiches individuelles du personnel (13)
├── actualite/              Articles d'actualité (7)
├── projets/                Fiches projets (1)
│
├── site.css                Feuille de style unique
├── app.js                  Toute l'interactivité (voir ci-dessous)
├── organisation-data.js    Structure organisationnelle (source de vérité)
├── structure.md            Ce fichier
│
└── assets/                 Images, polices URWGothic embarquées
```

## Header / Footer mutualisés

Chaque page ne contient que des placeholders — le HTML réel est injecté
par `app.js` (section 0) :

```html
<header class="site-header" data-site-header data-root=""></header>
...
<footer id="contact" class="site-footer" data-site-footer data-root=""></footer>
```

- `data-root` : `""` à la racine, `"../"` dans un sous-dossier (membres/,
  actualite/, projets/).
- Le lien actif de la navbar est déduit automatiquement du nom de fichier.
- Pour modifier le menu, le mega-menu ou le pied de page : éditer
  uniquement les templates de la section 0 de `app.js`, plus besoin de
  toucher les 34 pages.

## organisation-data.js

Source unique de la structure hiérarchique (chapitres I / II / III).
Consommée par `app.js` (section 7) pour rendre l'arbre de
`organigramme.html`, et servant de référence aux ancres
(`#cabinet`, `#commission-support`, `#tech-01`…).

## Convention de nommage

- Dossier des articles : `actualite/` (article individuel),
  page liste : `actualites.html`.
- Chaque nouveau fichier doit porter l'extension et des accents
  dans les slugs évités (ex. `crmp.html`, `cdcrp.html`).

## Dépendances CDN

- Swiper 11 (carrousel des instituts) — pages qui contiennent `.instituts-carousel`
- Font Awesome 6.4 (icônes réseaux sociaux) — ré-injecté par `app.js` si absent

Les polices (URWGothic) sont locales dans `assets/`.
