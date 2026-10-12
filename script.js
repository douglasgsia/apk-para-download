
const grid = document.getElementById('app-grid');
const searchInput = document.getElementById('search');
const categoriesEl = document.getElementById('categories');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');

let activeCategory = 'Todos';

const safe = value =>
  String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));

const categories = [
  'Todos',
  ...new Set(apps.map(app => app.category).filter(Boolean))
];

categoriesEl.innerHTML = categories.map(category => `
  <button
    class="category${category === activeCategory ? ' active' : ''}"
    type="button"
    data-category="${safe(category)}"
    aria-pressed="${category === activeCategory}"
  >
    ${safe(category)}
  </button>
`).join('');

categoriesEl.addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');

  if (!button) return;

  activeCategory = button.dataset.category;

  categoriesEl.querySelectorAll('.category').forEach(el => {
    const isActive = el === button;

    el.classList.toggle('active', isActive);
    el.setAttribute('aria-pressed', String(isActive));
  });

  render();
});

searchInput.addEventListener('input', render);

function render() {
  const term = searchInput.value
    .trim()
    .toLocaleLowerCase('pt-BR');

  const filtered = apps.filter(app => {
    const matchesCategory =
      activeCategory === 'Todos' ||
      app.category === activeCategory;

    const text = `
      ${app.name}
      ${app.category}
      ${app.description}
      ${app.version}
    `.toLocaleLowerCase('pt-BR');

    return matchesCategory && text.includes(term);
  });

  countEl.textContent =
    `${filtered.length} ${
      filtered.length === 1 ? 'aplicativo' : 'aplicativos'
    }`;

  emptyEl.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(app => {
    const initials = safe(
      (app.name || 'APK')
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0] || '')
        .join('')
        .toUpperCase()
    );

    const icon = app.icon
      ? `<img
           src="${safe(app.icon)}"
           alt=""
           loading="lazy"
           onerror="this.parentElement.textContent='${initials}'"
         >`
      : initials;

    const hasUrl = /^https?:\/\//i.test(app.url || '');

    const button = hasUrl
      ? `<a
           class="download"
           href="${safe(app.url)}"
           rel="noopener noreferrer"
         >↓ Baixar APK</a>`
      : `<span
           class="download disabled"
           title="Adicione o link do APK em apps.js"
         >Link ainda não configurado</span>`;

    return `
      <article class="app-card">
        <div class="app-top">
          <div class="app-icon">${icon}</div>

          <div>
            <div class="app-name">${safe(app.name)}</div>

            <div class="app-category">
              ${safe(app.category || 'Aplicativos')}${app.version
                ? ` · v${safe(app.version)}`
                : ''}
            </div>
          </div>
        </div>

        <p class="app-desc">${safe(app.description || '')}</p>

        <div class="app-actions">
          ${button}
        </div>
      </article>
    `;
  }).join('');
}

render();
