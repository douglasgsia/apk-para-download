const grid = document.getElementById('app-grid');
const searchInput = document.getElementById('search');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');

const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[ch]));

function render() {
  const term = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  const list = Array.isArray(window.apps) ? window.apps : [];
  const filtered = list.filter(app => {
    const text = `${app.name || ''} ${app.category || ''} ${app.description || ''}`
      .toLocaleLowerCase('pt-BR');
    return text.includes(term);
  });

  countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'aplicativo' : 'aplicativos'}`;
  emptyEl.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(app => {
    const initials = safe((app.name || 'APK').split(/\s+/).slice(0, 2)
      .map(part => part[0] || '').join('').toUpperCase());
    const icon = app.icon
      ? `<img src="${safe(app.icon)}" alt="" loading="lazy" onerror="this.remove();this.parentElement.textContent='${initials}'">`
      : initials;
    const hasUrl = /^https?:\/\//i.test(app.url || '');
    const button = hasUrl
      ? `<a class="download" href="${safe(app.url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↓</span> Baixar</a>`
      : `<span class="download disabled">Link ainda não configurado</span>`;

    return `<article class="app-card">
      <div class="app-top">
        <div class="app-icon">${icon}</div>
        <div class="app-name">${safe(app.name || 'Aplicativo')}</div>
        <div class="app-category">${safe(app.category || 'Aplicativos')}</div>
      </div>
      ${app.description ? `<p class="app-desc">${safe(app.description)}</p>` : ''}
      <div class="app-actions">${button}</div>
    </article>`;
  }).join('');
}

searchInput.addEventListener('input', render);
if (Array.isArray(window.apps)) {
  render();
} else {
  countEl.textContent = 'Não foi possível carregar os aplicativos.';
  emptyEl.hidden = false;
}
