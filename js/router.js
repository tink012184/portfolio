// Minimal hash router.
// URLs look like  #/about  or  #/projects#roc-tools  (second # = in-page anchor).

/**
 * @param {Array<{path: string, title: string}>} routes
 * @param {{outlet: HTMLElement, notFound: object, onNavigate?: (path: string) => void}} options
 */
function createRouter(routes, { outlet, notFound, onNavigate }) {
  let cleanup = null;

  function parse() {
    const raw = window.location.hash.replace(/^#/, "") || "/";
    const [pathPart, anchor] = raw.split("#");
    const path = pathPart.startsWith("/") ? pathPart : "/" + pathPart;
    return { path: path.length > 1 ? path.replace(/\/+$/, "") : path, anchor };
  }

  function render() {
    const { path, anchor } = parse();
    const route = routes.find((r) => r.path === path) || notFound;

    const page = window.Pages[route.name];
    if (typeof cleanup === "function") cleanup();
    outlet.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.dataset.page = route.name;
    wrapper.innerHTML = page.render();
    outlet.appendChild(wrapper);
    cleanup = page.mount ? page.mount(wrapper) : null;

    document.title = route.title;
    if (onNavigate) onNavigate(path);

    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);
  return { start: render };
}
