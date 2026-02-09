/**
 * Tests for HTML page structure — validates all pages have required elements
 */
const { readHTML } = require('./helpers');
const fs = require('fs');
const path = require('path');

const PAGES = ['index.html', 'about.html', 'blog.html', 'post.html', 'recipes.html', 'recipe.html'];

// ─── All pages must exist ──────────────────────────────

describe('Page files', () => {
  test.each(PAGES)('%s exists', (page) => {
    const filePath = path.join(__dirname, '..', page);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

// ─── All pages have proper HTML structure ──────────────

describe.each(PAGES)('%s structure', (page) => {
  let html;

  beforeAll(() => {
    html = readHTML(page);
  });

  test('has DOCTYPE declaration', () => {
    expect(html).toMatch(/<!DOCTYPE html>/i);
  });

  test('has lang attribute', () => {
    expect(html).toMatch(/<html\s+lang="en"/);
  });

  test('has charset meta', () => {
    expect(html).toContain('charset="UTF-8"');
  });

  test('has viewport meta', () => {
    expect(html).toContain('viewport');
    expect(html).toContain('width=device-width');
  });

  test('has title tag', () => {
    expect(html).toMatch(/<title[^>]*>.*<\/title>/);
  });

  test('loads styles.css', () => {
    expect(html).toContain('href="styles.css"');
  });

  test('loads site.js', () => {
    expect(html).toContain('src="site.js"');
  });

  test('has site-nav slot', () => {
    expect(html).toContain('id="site-nav"');
  });

  test('has site-footer slot', () => {
    expect(html).toContain('id="site-footer"');
  });

  test('calls Site.init()', () => {
    expect(html).toMatch(/Site\.init\(['"]\w+['"]\)/);
  });

  test('loads Google Fonts', () => {
    expect(html).toContain('fonts.googleapis.com');
    expect(html).toContain('DM+Serif+Display');
    expect(html).toContain('Outfit');
  });
});

// ─── Page-specific checks ──────────────────────────────

describe('index.html specifics', () => {
  let html;
  beforeAll(() => { html = readHTML('index.html'); });

  test('has hero section', () => {
    expect(html).toContain('class="hero"');
  });

  test('has email form', () => {
    expect(html).toContain('id="emailForm"');
  });

  test('has community section (commented out for later)', () => {
    expect(html).toContain('id="community"');
  });

  test('has video section (commented out for later)', () => {
    expect(html).toContain('id="videos"');
  });

  test('has join CTA section', () => {
    expect(html).toContain('id="join"');
  });

  test('has meta description', () => {
    expect(html).toMatch(/<meta\s+name="description"/);
  });
});

describe('blog.html specifics', () => {
  let html;
  beforeAll(() => { html = readHTML('blog.html'); });

  test('fetches posts.json', () => {
    expect(html).toContain("data/posts.json");
  });

  test('has search input', () => {
    expect(html).toContain('id="blogSearch"');
  });

  test('has filter buttons', () => {
    expect(html).toContain('id="blogFilters"');
    expect(html).toContain('data-filter="fitness"');
    expect(html).toContain('data-filter="nutrition"');
  });

  test('has blog grid container', () => {
    expect(html).toContain('id="blogGrid"');
  });

  test('has pagination container', () => {
    expect(html).toContain('id="blogPagination"');
  });

  test('has featured post container', () => {
    expect(html).toContain('id="featuredPost"');
  });

  test('filters out draft posts', () => {
    expect(html).toContain("status !== 'draft'");
  });

  test('has result count container', () => {
    expect(html).toContain('id="blogResults"');
  });
});

describe('post.html specifics', () => {
  let html;
  beforeAll(() => { html = readHTML('post.html'); });

  test('fetches posts.json', () => {
    expect(html).toContain("data/posts.json");
  });

  test('uses getParam for post ID', () => {
    expect(html).toContain("getParam('id')");
  });

  test('blocks draft posts', () => {
    expect(html).toContain("status === 'draft'");
  });

  test('renders post body with renderBody()', () => {
    expect(html).toContain('renderBody(');
  });

  test('has back link to blog', () => {
    expect(html).toContain('href="blog.html"');
  });
});

describe('recipes.html specifics', () => {
  let html;
  beforeAll(() => { html = readHTML('recipes.html'); });

  test('fetches recipes.json', () => {
    expect(html).toContain("data/recipes.json");
  });

  test('has search input', () => {
    expect(html).toContain('id="recipeSearch"');
  });

  test('has meal type filters', () => {
    expect(html).toContain('id="recipeFilters"');
    expect(html).toContain('data-filter="breakfast"');
    expect(html).toContain('data-filter="dinner"');
  });

  test('has tag filters', () => {
    expect(html).toContain('id="recipeTags"');
    expect(html).toContain('data-filter="high-protein"');
    expect(html).toContain('data-filter="quick"');
  });

  test('has recipe grid container', () => {
    expect(html).toContain('id="recipeGrid"');
  });

  test('filters out draft recipes', () => {
    expect(html).toContain("status !== 'draft'");
  });
});

describe('recipe.html specifics', () => {
  let html;
  beforeAll(() => { html = readHTML('recipe.html'); });

  test('fetches recipes.json', () => {
    expect(html).toContain("data/recipes.json");
  });

  test('uses getParam for recipe ID', () => {
    expect(html).toContain("getParam('id')");
  });

  test('blocks draft recipes', () => {
    expect(html).toContain("status === 'draft'");
  });

  test('has back link to recipes', () => {
    expect(html).toContain('href="recipes.html"');
  });

  test('displays macros', () => {
    expect(html).toContain('Calories');
    expect(html).toContain('Protein');
    expect(html).toContain('Carbs');
    expect(html).toContain('Fat');
  });
});

describe('about.html specifics', () => {
  let html;
  beforeAll(() => { html = readHTML('about.html'); });

  test('has page hero', () => {
    expect(html).toContain('class="page-hero"');
  });

  test('has meta description', () => {
    expect(html).toMatch(/<meta\s+name="description"/);
  });
});

// ─── CSS file ──────────────────────────────────────────

describe('styles.css', () => {
  let css;
  beforeAll(() => {
    css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  });

  test('exists and is non-empty', () => {
    expect(css.length).toBeGreaterThan(100);
  });

  test('has filter styles', () => {
    expect(css).toContain('.filter-btn');
    expect(css).toContain('.filter-bar');
    expect(css).toContain('.filter-search');
  });

  test('has pagination styles', () => {
    expect(css).toContain('.pagination');
  });

  test('has responsive breakpoints', () => {
    expect(css).toContain('@media');
    expect(css).toContain('max-width: 600px');
  });

  test('has blog styles', () => {
    expect(css).toContain('.blog-card');
    expect(css).toContain('.blog-featured');
  });

  test('has recipe styles', () => {
    expect(css).toContain('.recipe-card');
    expect(css).toContain('.recipe-grid');
  });

  test('has category badge styles', () => {
    expect(css).toContain('.cat-fitness');
    expect(css).toContain('.cat-nutrition');
  });

  test('has image support styles', () => {
    expect(css).toContain('.has-image');
    expect(css).toContain('.post-hero-image');
    expect(css).toContain('.recipe-hero-image');
  });
});

// ─── Required supporting files ─────────────────────────

describe('Supporting files', () => {
  test('site.js exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'site.js'))).toBe(true);
  });

  test('styles.css exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'styles.css'))).toBe(true);
  });

  test('data/posts.json exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'data', 'posts.json'))).toBe(true);
  });

  test('data/recipes.json exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'data', 'recipes.json'))).toBe(true);
  });

  test('CONTENT-GUIDE.md exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'CONTENT-GUIDE.md'))).toBe(true);
  });

  test('images directory exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'images'))).toBe(true);
  });

  test('content/posts directory exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'content', 'posts'))).toBe(true);
  });

  test('content/recipes directory exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'content', 'recipes'))).toBe(true);
  });

  test('build script exists', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'scripts', 'build.js'))).toBe(true);
  });

  test('content/posts has .md files matching posts.json count', () => {
    const mdFiles = fs.readdirSync(path.join(__dirname, '..', 'content', 'posts')).filter(f => f.endsWith('.md'));
    const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'posts.json'), 'utf8'));
    expect(mdFiles.length).toBe(posts.length);
  });

  test('content/recipes has .json files matching recipes.json count', () => {
    const jsonFiles = fs.readdirSync(path.join(__dirname, '..', 'content', 'recipes')).filter(f => f.endsWith('.json'));
    const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'recipes.json'), 'utf8'));
    expect(jsonFiles.length).toBe(recipes.length);
  });
});
