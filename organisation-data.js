// organisation-data.js
// À placer à la racine du projet et inclure AVANT app.js

window.CNDT_ORG = {
  root: {
    id: "cndt",
    label: "CNDT",
    url: "organigramme.html",
  },

  chapters: [
    /* ============================================================
       CHAPITRE I — CABINET DU SECRÉTAIRE PERMANENT
       ============================================================ */
    {
      id: "cabinet",
      code: "I",
      label: "Cabinet du Secrétaire Permanent",
      url: "cabinet.html",
      units: [
        { id: "secretariat-sp",         code: "I.1", label: "Secrétariat du Secrétaire Permanent",
          url: "organisation/cabinet/secretariat-sp.html" },
        { id: "audit-interne",          code: "I.2", label: "Cellule de Suivi, Contrôle et Audit Interne",
          url: "organisation/cabinet/audit-interne.html" },
        { id: "cellule-informatique",   code: "I.3", label: "Cellule Informatique",
          url: "organisation/cabinet/cellule-informatique.html" },
        { id: "comptabilite-matieres",  code: "I.4", label: "Comptabilité-Matières",
          url: "organisation/cabinet/comptabilite-matieres.html" },
        { id: "cellule-traduction",     code: "I.5", label: "Cellule de Traduction",
          url: "organisation/cabinet/cellule-traduction.html" },
        { id: "action-sociale",         code: "I.6", label: "Cellule de l'Action Sociale & du Multiculturalisme",
          url: "organisation/cabinet/action-sociale.html" },
        { id: "vulgarisation-transfert",code: "I.7", label: "Cellule de la Vulgarisation & Transfert",
          url: "organisation/cabinet/vulgarisation-transfert.html" },
      ],
    },

    /* ============================================================
       CHAPITRE II — COMMISSION OPÉRATIONNELLE
       ============================================================ */
    {
      id: "commission-operationnelle",
      code: "II",
      label: "Commission Opérationnelle",
      url: "organisation/commission-operationnelle.html",
      units: [
        {
          id: "recherche-projets",
          code: "II.1",
          label: "Commission Recherche & Management des Projets",
          url: null, // pas de page dédiée — figée par le chapitre
          children: [
            { id: "secretariat-recherche",     code: "II.1.1", label: "Secrétariat de la Recherche",
              url: "organisation/recherche-projets/secretariat-recherche.html" },
            { id: "maturation-projets",        code: "II.1.2", label: "Secrétariat de la Maturation des Projets",
              url: "organisation/recherche-projets/maturation-projets.html" },
            { id: "information-scientifique",  code: "II.1.3", label: "Secrétariat de l'Information Scientifique & Technique",
              url: "organisation/recherche-projets/information-scientifique.html" },
            { id: "prospective-conferences",   code: "II.1.4", label: "Secrétariat de la Prospective & des Conférences",
              url: "organisation/recherche-projets/prospective-conferences.html" },
            {
              id: "commissions-techniques",
              code: "II.1.5",
              label: "Secrétariats des Commissions Techniques",
              url: null,
              children: [
                { id: "tech-01-tic-ia",           code: "01", label: "TIC & Intelligence Artificielle",
                  url: "organisation/recherche-projets/commissions-techniques/01-tic-ia.html" },
                { id: "tech-02-transformations",  code: "02", label: "Technologies & Transformations Industrielles",
                  url: "organisation/recherche-projets/commissions-techniques/02-transformations.html" },
                { id: "tech-03-biosciences",      code: "03", label: "Biosciences & Technologies Agricoles",
                  url: "organisation/recherche-projets/commissions-techniques/03-biosciences.html" },
                { id: "tech-04-energie-mines",    code: "04", label: "Énergie, Mines & Environnement",
                  url: "organisation/recherche-projets/commissions-techniques/04-energie-mines.html" },
                { id: "tech-05-politiques",       code: "05", label: "Politiques Scientifiques & Technologiques",
                  url: "organisation/recherche-projets/commissions-techniques/05-politiques.html" },
              ],
            },
          ],
        },
        {
          id: "documentation-communication",
          code: "II.3",
          label: "Commission Documentation, Communication & Relations Publiques",
          url: null,
          children: [
            { id: "documentation-archives", code: "II.3.1", label: "Secrétariat de la Documentation & des Archives",
              url: "organisation/documentation-communication/documentation-archives.html" },
            { id: "communication",          code: "II.3.2", label: "Secrétariat de la Communication",
              url: "organisation/documentation-communication/communication.html" },
            { id: "relations-publiques",    code: "II.3.3", label: "Secrétariat des Relations Publiques",
              url: "organisation/documentation-communication/relations-publiques.html" },
          ],
        },
      ],
    },

    /* ============================================================
       CHAPITRE III — COMMISSION SUPPORT
       ============================================================ */
    {
      id: "commission-support",
      code: "III",
      label: "Commission Support",
      url: "organisation/commission-support.html",
      units: [
        {
          id: "rh-cooperation-juridique",
          code: "III.1",
          label: "Commission RH, Coopération & Affaires Juridiques",
          url: null,
          children: [
            { id: "cooperation-partenariat", code: "III.1.1", label: "Secrétariat de la Coopération & du Partenariat",
              url: "organisation/support/rh-cooperation-juridique/cooperation-partenariat.html" },
            { id: "ressources-humaines",     code: "III.1.2", label: "Secrétariat des Ressources Humaines",
              url: "organisation/support/rh-cooperation-juridique/ressources-humaines.html" },
            { id: "juridique-contentieux",   code: "III.1.3", label: "Secrétariat Juridique & du Contentieux",
              url: "organisation/support/rh-cooperation-juridique/juridique-contentieux.html" },
          ],
        },
        {
          id: "affaires-admin-financieres",
          code: "III.2",
          label: "Commission des Affaires Administratives, Financières & Engagements",
          url: null,
          children: [
            { id: "administration-generale",  code: "III.2.1", label: "Secrétariat chargé de l'Administration Générale",
              url: "organisation/support/affaires-admin-financieres/administration-generale.html" },
            { id: "affaires-financieres",     code: "III.2.2", label: "Secrétariat des Affaires Financières & Engagements",
              url: "organisation/support/affaires-admin-financieres/affaires-financieres.html" },
            { id: "preparation-budget",       code: "III.2.3", label: "Secrétariat Préparation & Suivi de l'Exécution du Budget",
              url: "organisation/support/affaires-admin-financieres/preparation-budget.html" },
            { id: "cati",                     code: "III.2.4", label: "Secrétariat en charge du CATI",
              url: "organisation/support/affaires-admin-financieres/cati.html" },
          ],
        },
      ],
    },
  ],
};