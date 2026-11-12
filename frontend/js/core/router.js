/**
 * Router berbasis hash.
 * Setiap route memiliki template halaman dan sebuah controller dengan
 * siklus hidup mount() / destroy().
 */
export class Router {
  constructor(routes, { guard = null, fallback = '/' } = {}) {
    this.routes = routes;
    this.guard = guard;
    this.fallback = fallback;
    this.current = null;
    this.currentPath = '/';
    this._onHashChange = () => this.resolve();
  }

  start() {
    window.addEventListener('hashchange', this._onHashChange);
    return this.resolve();
  }

  navigate(path, { replace = false } = {}) {
    const target = `#${path}`;
    if (window.location.hash === target) {
      return this.resolve();
    }

    if (replace) {
      window.history.replaceState(null, '', target);
      return this.resolve();
    }

    window.location.hash = path;
    return Promise.resolve();
  }

  async resolve() {
    const { path, query } = parseHash();
    const match = this.match(path);

    if (!match) {
      return this.navigate(this.fallback, { replace: true });
    }

    if (this.guard) {
      const allowed = await this.guard(match.route, { path, query });
      if (!allowed) return;
    }

    if (this.current) {
      this.current.destroy();
      this.current = null;
    }

    this.currentPath = path;
    const container = document.getElementById('app-view');
    if (!container) return;

    const { loadTemplate } = await import('./template-loader.js');
    const template = typeof match.route.template === 'function'
      ? match.route.template()
      : match.route.template;
    container.innerHTML = await loadTemplate(template);

    const controller = match.route.create(match.params, query);
    this.current = controller;
    await controller.mount();
  }

  match(path) {
    for (const route of this.routes) {
      const params = matchPath(route.path, path);
      if (params) return { route, params };
    }
    return null;
  }

  destroy() {
    window.removeEventListener('hashchange', this._onHashChange);
    if (this.current) this.current.destroy();
    this.current = null;
  }
}

export function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [rawPath, rawQuery = ''] = raw.split('?');
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const query = Object.fromEntries(new URLSearchParams(rawQuery).entries());
  return { path: path.replace(/\/+$/, '') || '/', query };
}

function matchPath(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const expected = patternParts[i];
    const actual = pathParts[i];

    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}
