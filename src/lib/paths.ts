// Zentrale, base-bewusste Pfadaufloesung. Niemals hart "/"-relativ verlinken,
// sonst brechen Links und Assets unter dem GitHub-Pages-Unterpfad.
const base = import.meta.env.BASE_URL;

export function link(path = ''): string {
  return `${base}/${path}`.replace(/\/{2,}/g, '/');
}

export function termHref(slug: string): string {
  return link(`glossar/${slug}/`);
}

export function domainHref(slug: string): string {
  return link(`domaenen/${slug}/`);
}
