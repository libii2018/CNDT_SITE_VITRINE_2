// organisation-data.js
// Structure organisationnelle du CNDT — source unique de vérité.
// À inclure AVANT app.js sur les pages qui en ont besoin (organigramme.html).

window.CNDT_ORG = {
  root: {
    id: "cndt",
    label: "CNDT",
    url: "organigramme.html",
  },

  chapters: [
    /* ============================================================
       CHAPITRE I — CABINET DU SECRÉTAIRE PERMANENT
       Page : cabinet.html
       ============================================================ */
    {
      id: "cabinet",
      code: "I",
      label: "Cabinet du Secrétaire Permanent",
      url: "cabinet.html",
      units: [
        { id: "secretariat-sp",         code: "I.1", label: "Secrétariat du Secrétaire Permanent",            url: null },
        { id: "audit-interne",          code: "I.2", label: "Cellule de Suivi, Contrôle et Audit Interne",     url: null },
        { id: "cellule-informatique",   code: "I.3", label: "Cellule Informatique",                           url: null },
        { id: "comptabilite-matieres",  code: "I.4", label: "Comptabilité-Matières",                          url: null },
        { id: "cellule-traduction",     code: "I.5", label: "Cellule de Traduction",                           url: null },
        { id: "action-sociale",         code: "I.6", label: "Cellule de l'Action Sociale & du Multiculturalisme", url: null },
        { id: "vulgarisation-transfert",code: "I.7", label: "Cellule de la Vulgarisation & Transfert",         url: null },
      ],
    },

    /* ============================================================
       CHAPITRE II — COMMISSION OPÉRATIONNELLE
       Pages : crmp.html, cdcrp.html, ct.html
       ============================================================ */
    {
      id: "commission-operationnelle",
      code: "II",
      label: "Commission Opérationnelle",
      url: null,
      units: [
        {
          id: "recherche-projets",
          code: "II.1",
          label: "Commission Recherche & Management des Projets",
          url: "crmp.html",
          children: [
            {
              id: "commissions-techniques",
              code: "II.1.5",
              label: "Secrétariats des Commissions Techniques",
              url: "ct.html",
              children: [
                { id: "tech-01-tic-ia",           code: "01", label: "TIC & Intelligence Artificielle",
                  url: "ct.html#tech-01" },
                { id: "tech-02-transformations",   code: "02", label: "Technologies & Transformations Industrielles",
                  url: "ct.html#tech-02" },
                { id: "tech-03-biosciences",       code: "03", label: "Biosciences & Technologies Agricoles",
                  url: "ct.html#tech-03" },
                { id: "tech-04-energie-mines",     code: "04", label: "Énergie, Mines & Environnement",
                  url: "ct.html#tech-04" },
                { id: "tech-05-politiques",        code: "05", label: "Politiques Scientifiques & Technologiques",
                  url: "ct.html#tech-05" },
              ],
            },
          ],
        },
        {
          id: "documentation-communication",
          code: "II.3",
          label: "Commission Documentation, Communication & Relations Publiques",
          url: "cdcrp.html",
        },
      ],
    },

    /* ============================================================
       CHAPITRE III — COMMISSION SUPPORT
       Pages : rhcaj.html, caaf.html
       ============================================================ */
    {
      id: "commission-support",
      code: "III",
      label: "Commission Support",
      url: null,
      units: [
        {
          id: "rh-cooperation-juridique",
          code: "III.1",
          label: "Commission RH, Coopération & Affaires Juridiques",
          url: "rhcaj.html",
        },
        {
          id: "affaires-admin-financieres",
          code: "III.2",
          label: "Commission des Affaires Administratives, Financières & Engagements",
          url: "caaf.html",
        },
      ],
    },
  ],
};
