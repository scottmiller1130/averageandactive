/**
 * Tests for site.js — core module functions
 */
const { createDOM } = require('./helpers');

let dom, Site;

beforeEach(() => {
  dom = createDOM('<div id="test-el"></div><div id="site-nav"></div><div id="site-footer"></div>');
  Site = dom.window.Site;
});

afterEach(() => {
  dom.window.close();
});

// ─── XSS Sanitization ─────────────────────────────────

describe('esc()', () => {
  test('escapes HTML special characters', () => {
    expect(Site.esc('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  test('escapes ampersands', () => {
    expect(Site.esc('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('escapes single quotes', () => {
    expect(Site.esc("it's")).toBe('it&#39;s');
  });

  test('handles non-string input gracefully', () => {
    expect(Site.esc(42)).toBe('42');
    expect(Site.esc(null)).toBe('');
    expect(Site.esc(undefined)).toBe('');
    expect(Site.esc(true)).toBe('true');
  });

  test('returns empty strings unchanged', () => {
    expect(Site.esc('')).toBe('');
  });

  test('leaves safe strings unchanged', () => {
    expect(Site.esc('Hello World 123')).toBe('Hello World 123');
  });
});

// ─── DOM helpers ───────────────────────────────────────

describe('setHTML()', () => {
  test('sets innerHTML on existing element', () => {
    Site.setHTML('test-el', '<p>hello</p>');
    expect(dom.window.document.getElementById('test-el').innerHTML).toBe('<p>hello</p>');
  });

  test('does nothing for non-existent element', () => {
    expect(() => Site.setHTML('missing-el', '<p>hello</p>')).not.toThrow();
  });
});

describe('showError()', () => {
  test('renders escaped error message into element', () => {
    Site.showError('test-el', 'Something <bad> happened');
    const html = dom.window.document.getElementById('test-el').innerHTML;
    expect(html).toContain('Something went wrong');
    expect(html).toContain('Something &lt;bad&gt; happened');
    expect(html).not.toContain('<bad>');
  });
});

// ─── Input validation ──────────────────────────────────

describe('getParam()', () => {
  test('returns valid slug params', () => {
    dom.window.history.pushState({}, '', '?id=my-test-post');
    expect(Site.getParam('id')).toBe('my-test-post');
  });

  test('returns null for missing params', () => {
    dom.window.history.pushState({}, '', '/');
    expect(Site.getParam('id')).toBeNull();
  });

  test('rejects params with uppercase letters', () => {
    dom.window.history.pushState({}, '', '?id=MyPost');
    expect(Site.getParam('id')).toBeNull();
  });

  test('rejects params with special characters', () => {
    dom.window.history.pushState({}, '', '?id=post<script>');
    expect(Site.getParam('id')).toBeNull();
  });

  test('rejects params starting with hyphen', () => {
    dom.window.history.pushState({}, '', '?id=-bad-slug');
    expect(Site.getParam('id')).toBeNull();
  });

  test('accepts slugs with numbers', () => {
    dom.window.history.pushState({}, '', '?id=5am-garage-gym');
    expect(Site.getParam('id')).toBe('5am-garage-gym');
  });
});

// ─── Validators ────────────────────────────────────────

describe('isValidPost()', () => {
  const validPost = {
    id: 'test', title: 'Test', category: 'fitness',
    date: '2026-01-01', excerpt: 'Test excerpt', body: []
  };

  test('accepts valid post object', () => {
    expect(Site.isValidPost(validPost)).toBe(true);
  });

  test('rejects null', () => {
    expect(Site.isValidPost(null)).toBeFalsy();
  });

  test('rejects post missing id', () => {
    const { id, ...rest } = validPost;
    expect(Site.isValidPost(rest)).toBeFalsy();
  });

  test('rejects post missing title', () => {
    const { title, ...rest } = validPost;
    expect(Site.isValidPost(rest)).toBeFalsy();
  });

  test('rejects post with non-array body', () => {
    expect(Site.isValidPost({ ...validPost, body: 'not an array' })).toBeFalsy();
  });

  test('rejects post missing category', () => {
    const { category, ...rest } = validPost;
    expect(Site.isValidPost(rest)).toBeFalsy();
  });

  test('rejects post missing date', () => {
    const { date, ...rest } = validPost;
    expect(Site.isValidPost(rest)).toBeFalsy();
  });

  test('rejects post missing excerpt', () => {
    const { excerpt, ...rest } = validPost;
    expect(Site.isValidPost(rest)).toBeFalsy();
  });
});

describe('isValidRecipe()', () => {
  const validRecipe = {
    id: 'test', title: 'Test', mealType: 'dinner',
    ingredients: ['a'], steps: ['b'], calories: 400
  };

  test('accepts valid recipe object', () => {
    expect(Site.isValidRecipe(validRecipe)).toBe(true);
  });

  test('rejects null', () => {
    expect(Site.isValidRecipe(null)).toBeFalsy();
  });

  test('rejects recipe missing id', () => {
    const { id, ...rest } = validRecipe;
    expect(Site.isValidRecipe(rest)).toBeFalsy();
  });

  test('rejects recipe with non-array ingredients', () => {
    expect(Site.isValidRecipe({ ...validRecipe, ingredients: 'not array' })).toBeFalsy();
  });

  test('rejects recipe with non-number calories', () => {
    expect(Site.isValidRecipe({ ...validRecipe, calories: '400' })).toBeFalsy();
  });

  test('rejects recipe missing mealType', () => {
    const { mealType, ...rest } = validRecipe;
    expect(Site.isValidRecipe(rest)).toBeFalsy();
  });
});

// ─── Date formatting ──────────────────────────────────

describe('formatDate()', () => {
  test('formats date as full month name', () => {
    const result = Site.formatDate('2026-01-15');
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });
});

describe('formatDateShort()', () => {
  test('formats date with abbreviated month', () => {
    const result = Site.formatDateShort('2026-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });
});

// ─── Category helpers ──────────────────────────────────

describe('catLabel()', () => {
  test('returns label for known category', () => {
    expect(Site.catLabel('fitness')).toBe('Fitness');
    expect(Site.catLabel('family')).toBe('Family Life');
  });

  test('returns escaped key for unknown category', () => {
    expect(Site.catLabel('unknown')).toBe('unknown');
  });
});

describe('catClass()', () => {
  test('returns CSS class for known category', () => {
    expect(Site.catClass('fitness')).toBe('cat-fitness');
    expect(Site.catClass('nutrition')).toBe('cat-nutrition');
  });

  test('returns empty string for unknown category', () => {
    expect(Site.catClass('unknown')).toBe('');
  });
});

// ─── Pagination ────────────────────────────────────────

describe('paginate()', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  test('returns correct first page', () => {
    const result = Site.paginate(items, 1, 3);
    expect(result.items).toEqual([1, 2, 3]);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(4);
    expect(result.hasPrev).toBe(false);
    expect(result.hasNext).toBe(true);
  });

  test('returns correct middle page', () => {
    const result = Site.paginate(items, 2, 3);
    expect(result.items).toEqual([4, 5, 6]);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(true);
  });

  test('returns correct last page', () => {
    const result = Site.paginate(items, 4, 3);
    expect(result.items).toEqual([10]);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(false);
  });

  test('handles empty array', () => {
    const result = Site.paginate([], 1, 3);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(0);
  });

  test('handles single page', () => {
    const result = Site.paginate([1, 2], 1, 5);
    expect(result.items).toEqual([1, 2]);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });
});

// ─── Shared components ─────────────────────────────────

describe('renderNav()', () => {
  test('contains logo linking to index', () => {
    const html = Site.renderNav('home');
    expect(html).toContain('href="index.html"');
    expect(html).toContain('Average');
  });

  test('contains all navigation links', () => {
    const html = Site.renderNav('home');
    expect(html).toContain('about.html');
    expect(html).toContain('blog.html');
    expect(html).toContain('recipes.html');
  });

  test('marks active page', () => {
    const html = Site.renderNav('blog');
    expect(html).toContain('class="active"');
  });

  test('contains join CTA', () => {
    const html = Site.renderNav('home');
    expect(html).toContain('Join the Journey');
  });

  test('home page uses anchor links for on-page sections', () => {
    const html = Site.renderNav('home');
    expect(html).toContain('href="#join"');
  });

  test('non-home pages use full paths for sections', () => {
    const html = Site.renderNav('blog');
    expect(html).toContain('href="index.html#join"');
  });
});

describe('renderFooter()', () => {
  test('contains footer content', () => {
    const html = Site.renderFooter();
    expect(html).toContain('<footer>');
    expect(html).toContain('Average');
  });

  test('contains social links', () => {
    const html = Site.renderFooter();
    expect(html).toContain('instagram.com/averageandactive');
    expect(html).toContain('youtube.com/@averageandactive');
  });

  test('social links open in new tab with noopener', () => {
    const html = Site.renderFooter();
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
  });

  test('contains copyright', () => {
    const html = Site.renderFooter();
    expect(html).toContain('2026');
  });
});

// ─── CATEGORIES and MEAL_BG constants ──────────────────

describe('CATEGORIES', () => {
  test('has all five categories', () => {
    expect(Object.keys(Site.CATEGORIES)).toEqual(
      expect.arrayContaining(['fitness', 'nutrition', 'family', 'longevity', 'mindset'])
    );
  });

  test('each category has label and css', () => {
    for (const cat of Object.values(Site.CATEGORIES)) {
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('css');
      expect(typeof cat.label).toBe('string');
      expect(typeof cat.css).toBe('string');
    }
  });
});

describe('MEAL_BG', () => {
  test('has all meal types', () => {
    expect(Object.keys(Site.MEAL_BG)).toEqual(
      expect.arrayContaining(['breakfast', 'lunch', 'dinner', 'snack', 'smoothie'])
    );
  });
});
