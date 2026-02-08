/* ===================================================
   Average & Active — Core Site Module
   Security, shared components, and utilities
   =================================================== */

'use strict';

const Site = (() => {

  // ─── XSS Sanitization ─────────────────────────────────
  // Escapes HTML entities in user/data-driven strings before DOM insertion
  const _escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str.replace(/[&<>"']/g, c => _escapeMap[c]);
  }

  // ─── Safe DOM helpers ──────────────────────────────────
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // ─── Fetch with error handling ─────────────────────────
  async function fetchJSON(url) {
    let res;
    try {
      res = await fetch(url);
    } catch {
      throw new Error('Network error — please check your connection and try again.');
    }
    if (!res.ok) throw new Error(`Failed to load data (${res.status}).`);
    return res.json();
  }

  // Shows a user-friendly error in a target element
  function showError(id, message) {
    setHTML(id, `
      <div style="text-align:center; padding:3rem 1rem;">
        <p style="color:var(--rust); font-weight:600; margin-bottom:0.5rem;">Something went wrong</p>
        <p style="color:var(--warm-gray); font-size:0.95rem;">${esc(message)}</p>
      </div>`);
  }

  // ─── Input validation ──────────────────────────────────
  function getParam(name) {
    const val = new URLSearchParams(window.location.search).get(name);
    if (!val) return null;
    // Only allow safe slug characters
    if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(val)) return null;
    return val;
  }

  // Basic structural validation for post objects
  function isValidPost(p) {
    return p && typeof p.id === 'string' && typeof p.title === 'string' &&
      typeof p.category === 'string' && typeof p.date === 'string' &&
      typeof p.excerpt === 'string' && Array.isArray(p.body);
  }

  // Basic structural validation for recipe objects
  function isValidRecipe(r) {
    return r && typeof r.id === 'string' && typeof r.title === 'string' &&
      typeof r.mealType === 'string' && Array.isArray(r.ingredients) &&
      Array.isArray(r.steps) && typeof r.calories === 'number';
  }

  // ─── Date formatting ──────────────────────────────────
  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // ─── Category mappings ─────────────────────────────────
  const CATEGORIES = {
    fitness:   { label: 'Fitness',     css: 'cat-fitness' },
    nutrition: { label: 'Nutrition',   css: 'cat-nutrition' },
    family:    { label: 'Family Life', css: 'cat-family' },
    longevity: { label: 'Longevity',   css: 'cat-longevity' },
    mindset:   { label: 'Mindset',     css: 'cat-mindset' }
  };

  const MEAL_BG = {
    breakfast: 'breakfast', lunch: 'lunch', dinner: 'dinner',
    snack: 'snack', smoothie: 'smoothie'
  };

  function catLabel(key) { return CATEGORIES[key]?.label || esc(key); }
  function catClass(key) { return CATEGORIES[key]?.css || ''; }

  // ─── Scroll-triggered animations ───────────────────────
  let _observer;
  function initAnimations() {
    _observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => _observer.observe(el));
  }

  function observeNew() {
    if (!_observer) return;
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => _observer.observe(el));
  }

  // ─── Mobile nav toggle ─────────────────────────────────
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // ─── Email form handler ────────────────────────────────
  function initEmailForm(formId) {
    const form = document.getElementById(formId || 'emailForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      this.innerHTML = '<p style="padding:1rem;color:var(--olive);font-weight:600;">You\'re in! Welcome to the journey.</p>';
    });
  }

  // ─── Pagination ────────────────────────────────────────
  function paginate(items, page, perPage) {
    const total = Math.ceil(items.length / perPage);
    const start = (page - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      page,
      totalPages: total,
      hasNext: page < total,
      hasPrev: page > 1
    };
  }

  function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) { setHTML(containerId, ''); return; }
    let html = '<div class="pagination">';
    if (currentPage > 1) {
      html += `<button class="page-btn" data-page="${currentPage - 1}">&larr; Prev</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    if (currentPage < totalPages) {
      html += `<button class="page-btn" data-page="${currentPage + 1}">Next &rarr;</button>`;
    }
    html += '</div>';
    setHTML(containerId, html);

    document.getElementById(containerId).addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn');
      if (!btn) return;
      onPageChange(parseInt(btn.dataset.page, 10));
      window.scrollTo({ top: document.getElementById(containerId).offsetTop - 120, behavior: 'smooth' });
    });
  }

  // ─── Filter tabs ───────────────────────────────────────
  function initFilters(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener('click', (e) => {
      if (!e.target.classList.contains('filter-btn')) return;
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      callback(e.target.dataset.filter);
    });
  }

  // ─── Shared nav HTML ───────────────────────────────────
  function renderNav(activePage) {
    const links = [
      { href: 'about.html', label: 'About', key: 'about' },
      { href: 'blog.html', label: 'Blog', key: 'blog' },
      { href: 'recipes.html', label: 'Recipes', key: 'recipes' },
      { href: 'index.html#community', label: 'Community', key: 'community' },
      { href: 'index.html#videos', label: 'Videos', key: 'videos' }
    ];
    const isHome = activePage === 'home';
    const navItems = links.map(l => {
      const href = (isHome && l.href.startsWith('index.html#')) ? l.href.replace('index.html', '') : l.href;
      const cls = l.key === activePage ? ' class="active"' : '';
      return `<li><a href="${href}"${cls}>${l.label}</a></li>`;
    }).join('');

    const joinHref = isHome ? '#join' : 'index.html#join';

    return `
    <nav>
      <a href="index.html" class="logo">Average <span>&amp;</span> Active</a>
      <ul class="nav-links" id="navLinks">
        ${navItems}
        <li><a href="${joinHref}" class="nav-cta">Join the Journey</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu">
        <span></span><span></span><span></span>
      </button>
    </nav>`;
  }

  // ─── Shared footer HTML ────────────────────────────────
  function renderFooter() {
    return `
    <footer>
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo">Average <span>&amp;</span> Active</div>
          <p>Real fitness for real people. We're just parents trying to stay healthy, active, and present for the long haul.</p>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="recipes.html">Recipes</a></li>
            <li><a href="index.html#videos">Videos</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Content</h4>
          <ul>
            <li><a href="blog.html">Fitness</a></li>
            <li><a href="blog.html">Nutrition</a></li>
            <li><a href="blog.html">Family Life</a></li>
            <li><a href="blog.html">Longevity</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://instagram.com/averageandactive" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="https://youtube.com/@averageandactive" target="_blank" rel="noopener">YouTube</a></li>
            <li><a href="https://tiktok.com/@averageandactive" target="_blank" rel="noopener">TikTok</a></li>
            <li><a href="index.html#join">Newsletter</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Average &amp; Active. Just getting started.</p>
        <div class="footer-socials">
          <a href="https://instagram.com/averageandactive" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://youtube.com/@averageandactive" target="_blank" rel="noopener" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
            </svg>
          </a>
          <a href="https://tiktok.com/@averageandactive" target="_blank" rel="noopener" aria-label="TikTok">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>`;
  }

  // ─── Page initialization ───────────────────────────────
  function init(activePage) {
    // Inject shared nav & footer
    const navSlot = document.getElementById('site-nav');
    const footerSlot = document.getElementById('site-footer');
    if (navSlot) navSlot.innerHTML = renderNav(activePage);
    if (footerSlot) footerSlot.innerHTML = renderFooter();

    initNav();
    initAnimations();
    initEmailForm('emailForm');
  }

  // ─── Public API ────────────────────────────────────────
  return {
    esc,
    setHTML,
    fetchJSON,
    showError,
    getParam,
    isValidPost,
    isValidRecipe,
    formatDate,
    formatDateShort,
    catLabel,
    catClass,
    CATEGORIES,
    MEAL_BG,
    initAnimations,
    observeNew,
    initNav,
    initEmailForm,
    paginate,
    renderPagination,
    initFilters,
    renderNav,
    renderFooter,
    init
  };
})();
