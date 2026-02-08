#!/usr/bin/env node

/**
 * Build script — compiles content files into data JSON
 *
 * Blog posts:  content/posts/*.md  → data/posts.json
 * Recipes:     content/recipes/*.json → data/recipes.json
 *
 * Usage: npm run build
 */

'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const RECIPES_DIR = path.join(ROOT, 'content', 'recipes');
const DATA_DIR = path.join(ROOT, 'data');

// ─── Markdown → body blocks ───────────────────────────
// Converts markdown tokens into the JSON body format
// that post.html already renders:
//   { type: "paragraph", text: "..." }
//   { type: "heading",   text: "..." }
//   { type: "list",      items: ["...", "..."] }

function markdownToBlocks(md) {
  const tokens = marked.lexer(md);
  const blocks = [];

  for (const token of tokens) {
    if (token.type === 'paragraph') {
      blocks.push({ type: 'paragraph', text: token.text });
    } else if (token.type === 'heading') {
      blocks.push({ type: 'heading', text: token.text });
    } else if (token.type === 'list') {
      const items = token.items.map(item => item.text.replace(/\n/g, ' ').trim());
      blocks.push({ type: 'list', items });
    }
    // Other token types (hr, code, etc.) are silently skipped for now
  }

  return blocks;
}

// ─── Build blog posts ──────────────────────────────────

function buildPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('  No content/posts/ directory — skipping posts build');
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();

  if (files.length === 0) {
    console.log('  No .md files in content/posts/ — skipping posts build');
    return;
  }

  const posts = [];
  const errors = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data: front, content } = matter(raw);

    // Derive ID from filename (without .md)
    const id = path.basename(file, '.md');

    // Validate required frontmatter
    const required = ['title', 'category', 'emoji', 'excerpt', 'date', 'readTime'];
    const missing = required.filter(key => !front[key]);
    if (missing.length) {
      errors.push(`  ✗ ${file}: missing frontmatter — ${missing.join(', ')}`);
      continue;
    }

    // Convert markdown body to blocks
    const body = markdownToBlocks(content);

    const post = {
      id,
      title: front.title,
      category: front.category,
      emoji: front.emoji,
      ...(front.image ? { image: front.image } : {}),
      excerpt: front.excerpt,
      date: typeof front.date === 'object' ? front.date.toISOString().slice(0, 10) : String(front.date),
      readTime: front.readTime,
      featured: front.featured === true,
      ...(front.status ? { status: front.status } : { status: 'published' }),
      body
    };

    posts.push(post);
    console.log(`  ✓ ${file}`);
  }

  if (errors.length) {
    errors.forEach(e => console.error(e));
  }

  // Sort by date descending (newest first) for consistency
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(
    path.join(DATA_DIR, 'posts.json'),
    JSON.stringify(posts, null, 2) + '\n'
  );

  console.log(`  → data/posts.json (${posts.length} post${posts.length !== 1 ? 's' : ''})\n`);
}

// ─── Build recipes ─────────────────────────────────────

function buildRecipes() {
  if (!fs.existsSync(RECIPES_DIR)) {
    console.log('  No content/recipes/ directory — skipping recipes build');
    return;
  }

  const files = fs.readdirSync(RECIPES_DIR).filter(f => f.endsWith('.json')).sort();

  if (files.length === 0) {
    console.log('  No .json files in content/recipes/ — skipping recipes build');
    return;
  }

  const recipes = [];
  const errors = [];

  for (const file of files) {
    const filePath = path.join(RECIPES_DIR, file);
    let recipe;

    try {
      recipe = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      errors.push(`  ✗ ${file}: invalid JSON — ${err.message}`);
      continue;
    }

    // Use filename as ID if not set
    if (!recipe.id) {
      recipe.id = path.basename(file, '.json');
    }

    // Ensure status defaults to published
    if (!recipe.status) {
      recipe.status = 'published';
    }

    recipes.push(recipe);
    console.log(`  ✓ ${file}`);
  }

  if (errors.length) {
    errors.forEach(e => console.error(e));
  }

  fs.writeFileSync(
    path.join(DATA_DIR, 'recipes.json'),
    JSON.stringify(recipes, null, 2) + '\n'
  );

  console.log(`  → data/recipes.json (${recipes.length} recipe${recipes.length !== 1 ? 's' : ''})\n`);
}

// ─── Run ───────────────────────────────────────────────

console.log('\nBuilding content...\n');
console.log('Blog posts:');
buildPosts();
console.log('Recipes:');
buildRecipes();
console.log('Done!\n');
