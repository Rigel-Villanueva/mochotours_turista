/**
 * Capa de Resiliencia para Datos del Sitio.
 *
 * Flujo de 3 capas:
 *   1. Backend OK → muestra datos del servidor → los cachea en localStorage
 *   2. Backend falla → muestra último cache guardado en localStorage
 *   3. Sin cache → cada componente usa FALLBACK_DATA hardcodeado
 *
 * El cache se refresca cada vez que el backend responde correctamente.
 */

import { getSiteContent, SiteContent } from '@/entities/site-content';

const CACHE_KEY = 'mochotours_site_content_cache';
const CACHE_TIMESTAMP_KEY = 'mochotours_site_content_ts';

/**
 * Obtiene contenido del sitio con fallback inteligente:
 * Backend → Cache localStorage → null (componente usa FALLBACK_DATA)
 */
async function fetchSiteContent(): Promise<SiteContent | null> {
  try {
    // Intentar obtener datos frescos del backend
    const data = await getSiteContent();

    // Si el backend respondió, cachear en localStorage
    if (data && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch {
        // localStorage lleno o no disponible — ignorar silenciosamente
      }
    }

    return data;
  } catch {
    // Backend falló — intentar recuperar del cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          return JSON.parse(cached) as SiteContent;
        }
      } catch {
        // Cache corrupto — ignorar
      }
    }

    // Sin cache — retornar null (el componente usará FALLBACK_DATA)
    return null;
  }
}

// Varios componentes de la misma página (hero, mapa, pie) piden el mismo contenido.
// Se comparte una sola petición durante 60 s en vez de repetirla por componente.
const SHARE_WINDOW_MS = 60_000;
let sharedRequest: Promise<SiteContent | null> | null = null;
let sharedAt = 0;

export function getCachedSiteContent(): Promise<SiteContent | null> {
  const now = Date.now();
  if (!sharedRequest || now - sharedAt > SHARE_WINDOW_MS) {
    sharedAt = now;
    sharedRequest = fetchSiteContent();
  }
  return sharedRequest;
}

/**
 * Valida si una URL de imagen es accesible.
 * Si no lo es, retorna la URL local de fallback.
 */
export function getImageWithFallback(
  serverUrl: string | null | undefined,
  localFallback: string
): string {
  // Si no hay URL del servidor, usar local directamente
  if (!serverUrl) return localFallback;

  // Si la URL del servidor es una ruta local (/algo.jpg), es segura
  if (serverUrl.startsWith('/')) return serverUrl;

  // Si es una URL externa, la usamos pero el componente ResilientImage
  // se encargará del onError
  return serverUrl;
}
