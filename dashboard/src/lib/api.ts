// Client de l'API CNDT — gestion du token Sanctum
export const API_URL = "http://127.0.0.1:8000/api/v1";
const TOKEN_KEY = "cndt_admin_token";
const USER_KEY = "cndt_admin_user";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: ApiUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = any>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    const message =
      data.errors
        ? Object.values(data.errors).flat().join(" ")
        : data.message || `Erreur ${res.status}`;
    throw new ApiError(message, res.status);
  }
  return data as T;
}

// ---------- Types du contenu ----------
export interface Paginated<T> {
  data: T[];
  meta?: { total?: number; current_page?: number; last_page?: number };
}

export interface Article {
  id: number; title: string; slug: string; category: string | null;
  excerpt: string | null; content: string | null; cover_image: string | null;
  is_published: boolean; published_at: string | null; created_at: string;
}
export interface Publication {
  id: number; title: string; slug: string; type: string | null;
  description: string | null; file_path: string | null; cover_image: string | null;
  is_published: boolean; published_at: string | null;
}
export interface Photo {
  id: number; album_id: number; path: string; caption: string | null; position: number;
}
export interface Album {
  id: number; title: string; slug: string; description: string | null;
  cover_image: string | null; position: number; photos?: Photo[];
}
export interface Member {
  id: number; first_name: string; last_name: string; full_name?: string;
  slug: string; role: string | null; unit: string | null; chapter: string | null;
  email: string | null; phone: string | null; photo: string | null;
  biography: string | null; is_visible: boolean; position: number;
}
export interface Project {
  id: number; title: string; slug: string; status: string;
  summary: string | null; description?: string | null; partner: string | null;
  cover_image: string | null; link: string | null;
  start_date: string | null; end_date: string | null; is_published: boolean;
}
export interface Message {
  id: number; name: string; email: string; phone: string | null;
  subject: string | null; message: string; is_read: boolean; created_at: string;
}
export interface OrgUnit {
  id: number; parent_id: number | null; code: string; label: string;
  slug: string | null; url: string | null; position: number;
  children?: OrgUnit[];
}
export interface Stats {
  articles: number; published_articles: number; publications: number;
  albums: number; photos: number; members: number; projects: number;
  messages: number; unread_messages: number;
}
