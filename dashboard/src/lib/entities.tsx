import type { ReactNode } from "react";

// Configuration générique des entités CRUD du dashboard

export type FieldType =
  | "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "email" | "url"
  | "richtext" | "image" | "gallery" | "member";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<[string, string]>;
}

export interface ColumnConfig<T = any> {
  label: string;
  key?: string;
  render?: (item: T) => ReactNode;
}

export interface EntityConfig {
  key: string;
  title: string;
  singular: string;
  endpoint: string;
  idKey: "slug" | "id";
  columns: ColumnConfig[];
  fields: FieldConfig[];
  orderable?: boolean;
}

const fmt = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "—";

export const ENTITIES: Record<string, EntityConfig> = {
  articles: {
    key: "articles",
    title: "Actualités",
    singular: "une actualité",
    endpoint: "/articles",
    idKey: "slug",
    columns: [
      { label: "Titre", key: "title" },
      { label: "Catégorie", key: "category" },
      { label: "Publié", render: (a) => (a.is_published ? "Oui" : "Non") },
      { label: "Date", render: (a) => fmt(a.published_at) },
    ],
    fields: [
      { key: "title", label: "Titre", type: "text", required: true },
      { key: "category", label: "Catégorie", type: "text" },
      { key: "excerpt", label: "Extrait", type: "textarea" },
      { key: "content", label: "Contenu de l'article (rédacteur)", type: "richtext" },
      { key: "gallery", label: "Galerie de l'article", type: "gallery" },
      { key: "author_member", label: "Auteur (personnel du CNDT) — badge « Rédigé par »", type: "member" },
      { key: "cover_image", label: "Image de couverture", type: "image" },
      { key: "is_published", label: "Publié", type: "checkbox" },
    ],
  },

  publications: {
    key: "publications",
    title: "Publications",
    singular: "une publication",
    endpoint: "/publications",
    idKey: "slug",
    columns: [
      { label: "Titre", key: "title" },
      { label: "Type", key: "type" },
      { label: "Publié", render: (p) => (p.is_published ? "Oui" : "Non") },
      { label: "Date", render: (p) => fmt(p.published_at) },
    ],
    fields: [
      { key: "title", label: "Titre", type: "text", required: true },
      {
        key: "type", label: "Type", type: "select",
        options: [
          ["rapport", "Rapport"], ["communique", "Communiqué"],
          ["revue", "Revue"], ["discours", "Discours"],
        ],
      },
      { key: "description", label: "Description", type: "textarea" },
      { key: "file_path", label: "Fichier (chemin ou URL)", type: "text" },
      { key: "cover_image", label: "Image de couverture", type: "image" },
      { key: "is_published", label: "Publié", type: "checkbox" },
    ],
  },

  albums: {
    key: "albums",
    title: "Galerie (albums)",
    singular: "un album",
    endpoint: "/albums",
    idKey: "slug",
    columns: [
      { label: "Album", key: "title" },
      { label: "Photos", render: (a) => `${a.photos?.length ?? 0} photo(s)` },
      { label: "Ordre", key: "position" },
    ],
    fields: [
      { key: "title", label: "Titre", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "cover_image", label: "Image de couverture", type: "image" },
      { key: "position", label: "Position", type: "number" },
    ],
  },

  members: {
    key: "members",
    title: "Personnel",
    singular: "un membre",
    endpoint: "/members",
    idKey: "slug",
    columns: [
      { label: "Nom", key: "full_name" },
      { label: "Fonction", key: "role" },
      { label: "Unité", key: "unit" },
      { label: "Visible", render: (m) => (m.is_visible ? "Oui" : "Non") },
    ],
    fields: [
      { key: "first_name", label: "Prénom", type: "text", required: true },
      { key: "last_name", label: "Nom", type: "text", required: true },
      { key: "role", label: "Fonction", type: "text" },
      { key: "unit", label: "Unité / Commission", type: "text" },
      { key: "chapter", label: "Chapitre (I, II, III…)", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Téléphone", type: "text" },
      { key: "photo", label: "Photo", type: "image" },
      { key: "biography", label: "Biographie", type: "textarea" },
      { key: "is_visible", label: "Visible sur le site", type: "checkbox" },
      { key: "position", label: "Position", type: "number" },
    ],
  },

  projects: {
    key: "projects",
    title: "Projets",
    singular: "un projet",
    endpoint: "/projects",
    idKey: "slug",
    columns: [
      { label: "Projet", key: "title" },
      { label: "Statut", key: "status" },
      { label: "Publié", render: (p) => (p.is_published ? "Oui" : "Non") },
      { label: "Début", key: "start_date" },
    ],
    fields: [
      { key: "title", label: "Titre", type: "text", required: true },
      {
        key: "status", label: "Statut", type: "select",
        options: [["a_venir", "À venir"], ["en_cours", "En cours"], ["termine", "Terminé"]],
      },
      { key: "summary", label: "Résumé", type: "textarea" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "partner", label: "Partenaire", type: "text" },
      { key: "cover_image", label: "Image de couverture", type: "image" },
      { key: "link", label: "Lien externe (URL)", type: "url" },
      { key: "start_date", label: "Date de début", type: "date" },
      { key: "end_date", label: "Date de fin", type: "date" },
      { key: "is_published", label: "Publié", type: "checkbox" },
    ],
  },

  instituts: {
    key: "instituts",
    title: "Carrousel instituts",
    singular: "un institut",
    endpoint: "/instituts",
    idKey: "id",
    orderable: true,
    columns: [
      { label: "Institut", key: "name" },
      { label: "Logo", key: "logo" },
      { label: "Position", key: "position" },
      { label: "Visible", render: (i) => (i.is_visible ? "Oui" : "Non") },
    ],
    fields: [
      { key: "name", label: "Nom de l'institut", type: "text", required: true },
      { key: "url", label: "Site web (URL)", type: "url" },
      { key: "logo", label: "Logo (glisser-déposer ou chemin)", type: "image" },
      { key: "position", label: "Position dans le carrousel", type: "number" },
      { key: "is_visible", label: "Visible dans le carrousel", type: "checkbox" },
    ],
  },
};

export const SECTIONS = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "articles", label: "Actualités" },
  { key: "publications", label: "Publications" },
  { key: "albums", label: "Galerie" },
  { key: "members", label: "Personnel" },
  { key: "projects", label: "Projets" },
  { key: "messages", label: "Messages" },
  { key: "organigramme", label: "Organigramme" },
  { key: "instituts", label: "Carrousel instituts" },
];
