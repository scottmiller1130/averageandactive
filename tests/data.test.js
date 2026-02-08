/**
 * Tests for data file integrity — validates posts.json and recipes.json
 */
const { loadJSON, createDOM } = require('./helpers');

let dom, Site;

beforeAll(() => {
  dom = createDOM();
  Site = dom.window.Site;
});

afterAll(() => {
  dom.window.close();
});

// ─── posts.json ────────────────────────────────────────

describe('posts.json', () => {
  let posts;

  beforeAll(() => {
    posts = loadJSON('posts.json');
  });

  test('is a non-empty array', () => {
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  test('every post passes isValidPost()', () => {
    posts.forEach(post => {
      expect(Site.isValidPost(post)).toBe(true);
    });
  });

  test('all post IDs are unique', () => {
    const ids = posts.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('all post IDs are valid slugs', () => {
    posts.forEach(post => {
      expect(post.id).toMatch(/^[a-z0-9][a-z0-9-]{2,120}$/);
    });
  });

  test('all categories are valid', () => {
    const validCats = ['fitness', 'nutrition', 'family', 'longevity', 'mindset'];
    posts.forEach(post => {
      expect(validCats).toContain(post.category);
    });
  });

  test('all dates are valid YYYY-MM-DD format', () => {
    posts.forEach(post => {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(post.date + 'T00:00:00').toString()).not.toBe('Invalid Date');
    });
  });

  test('at most one post is featured', () => {
    const featured = posts.filter(p => p.featured === true);
    expect(featured.length).toBeLessThanOrEqual(1);
  });

  test('body blocks have valid types', () => {
    const validTypes = ['paragraph', 'heading', 'list'];
    posts.forEach(post => {
      post.body.forEach(block => {
        expect(validTypes).toContain(block.type);
        if (block.type === 'paragraph' || block.type === 'heading') {
          expect(typeof block.text).toBe('string');
          expect(block.text.length).toBeGreaterThan(0);
        }
        if (block.type === 'list') {
          expect(Array.isArray(block.items)).toBe(true);
          expect(block.items.length).toBeGreaterThan(0);
        }
      });
    });
  });

  test('excerpts are reasonable length', () => {
    posts.forEach(post => {
      expect(post.excerpt.length).toBeGreaterThan(10);
      expect(post.excerpt.length).toBeLessThan(500);
    });
  });

  test('readTime field is present and formatted', () => {
    posts.forEach(post => {
      expect(typeof post.readTime).toBe('string');
      expect(post.readTime).toMatch(/\d+\s*min/);
    });
  });

  test('draft posts have valid status field', () => {
    posts.forEach(post => {
      if (post.status) {
        expect(['draft', 'published']).toContain(post.status);
      }
    });
  });

  test('image field is a valid relative path when present', () => {
    posts.forEach(post => {
      if (post.image) {
        expect(typeof post.image).toBe('string');
        expect(post.image).toMatch(/^images\/.+\.(jpg|jpeg|png|webp|avif)$/i);
      }
    });
  });
});

// ─── recipes.json ──────────────────────────────────────

describe('recipes.json', () => {
  let recipes;

  beforeAll(() => {
    recipes = loadJSON('recipes.json');
  });

  test('is a non-empty array', () => {
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
  });

  test('every recipe passes isValidRecipe()', () => {
    recipes.forEach(r => {
      expect(Site.isValidRecipe(r)).toBe(true);
    });
  });

  test('all recipe IDs are unique', () => {
    const ids = recipes.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('all recipe IDs are valid slugs', () => {
    recipes.forEach(r => {
      expect(r.id).toMatch(/^[a-z0-9][a-z0-9-]{2,120}$/);
    });
  });

  test('all meal types are valid', () => {
    const validTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'smoothie'];
    recipes.forEach(r => {
      expect(validTypes).toContain(r.mealType);
    });
  });

  test('all difficulties are valid', () => {
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    recipes.forEach(r => {
      expect(validDifficulties).toContain(r.difficulty);
    });
  });

  test('macros are positive numbers', () => {
    recipes.forEach(r => {
      expect(r.calories).toBeGreaterThan(0);
      expect(r.protein).toBeGreaterThanOrEqual(0);
      expect(r.carbs).toBeGreaterThanOrEqual(0);
      expect(r.fat).toBeGreaterThanOrEqual(0);
    });
  });

  test('servings is a positive integer', () => {
    recipes.forEach(r => {
      expect(Number.isInteger(r.servings)).toBe(true);
      expect(r.servings).toBeGreaterThan(0);
    });
  });

  test('ingredients and steps are non-empty arrays of strings', () => {
    recipes.forEach(r => {
      expect(r.ingredients.length).toBeGreaterThan(0);
      expect(r.steps.length).toBeGreaterThan(0);
      r.ingredients.forEach(i => expect(typeof i).toBe('string'));
      r.steps.forEach(s => expect(typeof s).toBe('string'));
    });
  });

  test('tags are valid when present', () => {
    const validTags = ['high-protein', 'quick', 'meal-prep', 'family-friendly', 'no-cook', 'post-workout', 'sourdough', 'bread', 'homemade', 'fermented', 'high-altitude', 'dutch-oven', 'whole-food', 'dairy-free', 'vegan'];
    recipes.forEach(r => {
      if (Array.isArray(r.tags)) {
        r.tags.forEach(tag => {
          expect(validTags).toContain(tag);
        });
      }
    });
  });

  test('draft recipes have valid status field', () => {
    recipes.forEach(r => {
      if (r.status) {
        expect(['draft', 'published']).toContain(r.status);
      }
    });
  });

  test('image field is a valid relative path when present', () => {
    recipes.forEach(r => {
      if (r.image) {
        expect(typeof r.image).toBe('string');
        expect(r.image).toMatch(/^images\/.+\.(jpg|jpeg|png|webp|avif)$/i);
      }
    });
  });
});
