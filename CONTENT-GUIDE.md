# Content Management Guide

Blog posts are written as **markdown files** and recipes as **individual JSON files**. A build script compiles them into the data files the website reads.

---

## Writing a New Blog Post

1. Create a new file in `content/posts/` named with your slug: `my-new-post.md`
2. Write your post using the template below
3. Run `npm run build` in your terminal
4. Done — the site reads the updated `data/posts.json`

### Template

```markdown
---
title: "Your Post Title"
category: fitness
emoji: "🏋️"
image: "images/my-post-photo.jpg"
excerpt: "A 1-2 sentence preview shown on the blog listing page."
date: "2026-02-15"
readTime: "6 min"
featured: false
status: published
---

Your opening paragraph here. Just write naturally.

## Section Heading

Another paragraph of content.

- Bullet point one
- Bullet point two
- Bullet point three

More text below the list.
```

### Blog Post Fields (frontmatter)

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Full title of the article |
| `category` | Yes | One of: `fitness`, `nutrition`, `family`, `longevity`, `mindset` |
| `emoji` | Yes | Single emoji for the card thumbnail (fallback when no image) |
| `image` | No | Path to a photo (e.g., `"images/my-post.jpg"`). Shows on the card and as a hero image |
| `excerpt` | Yes | 1-2 sentence summary for the listing page |
| `date` | Yes | Publish date in `YYYY-MM-DD` format. Posts sort by date (newest first) |
| `readTime` | Yes | Estimated read time (e.g., `"6 min"`) |
| `featured` | No | Set to `true` to make this the featured/hero post. Only one post should be `true` |
| `status` | No | Set to `draft` to hide from the site. Omit or use `published` to show it |

### Markdown formatting

- **Paragraphs:** Just write text. Blank lines separate paragraphs.
- **Headings:** Use `## Heading Text` (level 2 headings)
- **Lists:** Use `- Item` for bullet points

The post ID (used in the URL) comes from the filename: `my-new-post.md` becomes `post.html?id=my-new-post`.

---

## Adding a New Recipe

1. Create a new file in `content/recipes/` named with your slug: `my-new-recipe.json`
2. Fill in the template below
3. Run `npm run build` in your terminal
4. Done — the site reads the updated `data/recipes.json`

### Template

```json
{
  "title": "Recipe Name",
  "mealType": "dinner",
  "emoji": "🍗",
  "image": "images/my-recipe-photo.jpg",
  "description": "Short description shown on the recipe card.",
  "prepTime": "25 min",
  "servings": 4,
  "difficulty": "Easy",
  "calories": 480,
  "protein": 42,
  "carbs": 35,
  "fat": 16,
  "status": "published",
  "tags": ["high-protein", "meal-prep"],
  "ingredients": [
    "1.5 lbs chicken breast",
    "2 cups brown rice",
    "1 can black beans"
  ],
  "steps": [
    "Cook rice according to package directions.",
    "Season and grill the chicken.",
    "Assemble bowls with rice, chicken, and beans."
  ]
}
```

**Note:** You do NOT need an `id` field — it comes from the filename (`my-new-recipe.json` becomes `recipe.html?id=my-new-recipe`).

### Recipe Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Recipe name |
| `mealType` | Yes | One of: `breakfast`, `lunch`, `dinner`, `snack`, `smoothie` |
| `emoji` | Yes | Single emoji for the card thumbnail (fallback when no image) |
| `image` | No | Path to a photo (e.g., `"images/my-recipe.jpg"`). Shows on the card and as a hero image |
| `description` | Yes | 1-2 sentence description for the card |
| `prepTime` | Yes | Total prep + cook time (e.g., `"25 min"`) |
| `servings` | Yes | Number of servings (number) |
| `difficulty` | Yes | `"Easy"`, `"Medium"`, or `"Hard"` |
| `calories` | Yes | Calories per serving (number) |
| `protein` | Yes | Grams of protein per serving (number) |
| `carbs` | Yes | Grams of carbs per serving (number) |
| `fat` | Yes | Grams of fat per serving (number) |
| `status` | No | Set to `"draft"` to hide from the site. Omit or use `"published"` to show it |
| `tags` | Yes | Array of tags: `"high-protein"`, `"quick"`, `"meal-prep"`, `"family-friendly"`, `"no-cook"`, `"post-workout"` |
| `ingredients` | Yes | Array of ingredient strings |
| `steps` | Yes | Array of instruction strings (numbered automatically) |

---

## Quick Workflow

### New blog post:
1. Create `content/posts/my-post-slug.md`
2. Add the frontmatter (title, category, etc.) and write your content in markdown
3. Run `npm run build`
4. Commit and push

### New recipe:
1. Create `content/recipes/my-recipe-slug.json`
2. Fill in the fields (copy an existing recipe as a template)
3. Run `npm run build`
4. Commit and push

---

## File Structure

```
averageandactive/
├── content/
│   ├── posts/              ← Write blog posts here (one .md file per post)
│   │   ├── 5am-garage-gym-routine.md
│   │   └── macro-tracking-lazy-guide.md
│   └── recipes/            ← Add recipes here (one .json file per recipe)
│       ├── chicken-rice-power-bowl.json
│       └── sheet-pan-chicken-veggies.json
├── data/                   ← Auto-generated by build script (don't edit directly)
│   ├── posts.json
│   └── recipes.json
├── images/                 ← Photos for posts and recipes
├── scripts/
│   └── build.js            ← The build script
├── index.html
├── blog.html
├── post.html
├── recipes.html
├── recipe.html
├── about.html
├── styles.css
└── site.js
```

## Tips

- **IDs come from filenames.** `my-new-post.md` → ID is `my-new-post`. Use lowercase with hyphens.
- **Dates control sort order.** Newest posts appear first on the blog
- **Only one featured post.** Set `featured: true` on the one you want highlighted at the top of the blog
- **Categories and meal types control the filter buttons.** Stick to the values listed above so filtering works
- **Draft mode.** Set `status: draft` in the frontmatter (posts) or `"status": "draft"` in the JSON (recipes) to hide content. Change to `published` when ready
- **Adding photos.** Drop your image into `images/`, then add `image: "images/filename.jpg"` to the frontmatter or JSON. Recommended: 1200x675px, under 500KB
- **Always run `npm run build`** after adding or editing content. This regenerates the data files the website reads
- **Don't edit `data/posts.json` or `data/recipes.json` directly** — they get overwritten by the build script
