# Content Management Guide

All blog posts and recipes are stored as JSON data files. The website reads these files and renders the content automatically — no HTML editing needed.

---

## Adding a New Blog Post

Open `data/posts.json` and add a new object to the array:

```json
{
  "id": "your-post-slug",
  "title": "Your Post Title",
  "category": "fitness",
  "emoji": "🏋️",
  "excerpt": "A 1-2 sentence preview shown on the blog listing page.",
  "date": "2026-02-15",
  "readTime": "6 min",
  "featured": false,
  "body": [
    { "type": "paragraph", "text": "Your opening paragraph here." },
    { "type": "heading", "text": "Section Heading" },
    { "type": "paragraph", "text": "More content here." },
    { "type": "list", "items": ["Item one", "Item two", "Item three"] }
  ]
}
```

### Blog Post Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | URL-friendly slug (lowercase, hyphens, no spaces). Used in the URL: `post.html?id=your-post-slug` |
| `title` | Yes | Full title of the article |
| `category` | Yes | One of: `fitness`, `nutrition`, `family`, `longevity`, `mindset` |
| `emoji` | Yes | Single emoji shown as the card thumbnail |
| `excerpt` | Yes | 1-2 sentence summary for the listing page |
| `date` | Yes | Publish date in `YYYY-MM-DD` format. Posts sort by date (newest first) |
| `readTime` | Yes | Estimated read time (e.g., `"6 min"`) |
| `featured` | Yes | Set to `true` to make this the featured/hero post. Only one post should be `true` |
| `body` | Yes | Array of content blocks (see below) |

### Body Content Blocks

- **Paragraph:** `{ "type": "paragraph", "text": "Your text here." }`
- **Heading:** `{ "type": "heading", "text": "Section Title" }`
- **List:** `{ "type": "list", "items": ["Item 1", "Item 2"] }`

---

## Adding a New Recipe

Open `data/recipes.json` and add a new object to the array:

```json
{
  "id": "your-recipe-slug",
  "title": "Recipe Name",
  "mealType": "dinner",
  "emoji": "🍗",
  "description": "Short description shown on the recipe card.",
  "prepTime": "25 min",
  "servings": 4,
  "difficulty": "Easy",
  "calories": 480,
  "protein": 42,
  "carbs": 35,
  "fat": 16,
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

### Recipe Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | URL-friendly slug. Used in the URL: `recipe.html?id=your-recipe-slug` |
| `title` | Yes | Recipe name |
| `mealType` | Yes | One of: `breakfast`, `lunch`, `dinner`, `snack`, `smoothie` |
| `emoji` | Yes | Single emoji for the card thumbnail |
| `description` | Yes | 1-2 sentence description for the card |
| `prepTime` | Yes | Total prep + cook time (e.g., `"25 min"`) |
| `servings` | Yes | Number of servings (number) |
| `difficulty` | Yes | `"Easy"`, `"Medium"`, or `"Hard"` |
| `calories` | Yes | Calories per serving (number) |
| `protein` | Yes | Grams of protein per serving (number) |
| `carbs` | Yes | Grams of carbs per serving (number) |
| `fat` | Yes | Grams of fat per serving (number) |
| `tags` | Yes | Array of tags: `"high-protein"`, `"quick"`, `"meal-prep"`, `"family-friendly"`, `"no-cook"`, `"post-workout"` |
| `ingredients` | Yes | Array of ingredient strings |
| `steps` | Yes | Array of instruction strings (numbered automatically) |

---

## Quick Checklist

### New blog post:
1. Open `data/posts.json`
2. Add your new post object (copy an existing one as a template)
3. Give it a unique `id`
4. Set `featured: true` if you want it as the hero post (set the old featured to `false`)
5. Save the file — done!

### New recipe:
1. Open `data/recipes.json`
2. Add your new recipe object (copy an existing one as a template)
3. Give it a unique `id`
4. Save the file — done!

---

## File Structure

```
averageandactive/
├── index.html          — Homepage
├── about.html          — About page
├── blog.html           — Blog listing (reads from data/posts.json)
├── post.html           — Individual post page (reads from data/posts.json)
├── recipes.html        — Recipe listing (reads from data/recipes.json)
├── recipe.html         — Individual recipe page (reads from data/recipes.json)
├── styles.css          — Shared stylesheet
└── data/
    ├── posts.json      — All blog post content
    └── recipes.json    — All recipe content
```

## Tips

- **IDs must be unique.** Use lowercase with hyphens: `my-new-post`, `chicken-stir-fry`
- **Dates control sort order.** Newest posts appear first on the blog
- **Only one featured post.** Set `featured: true` on the one you want highlighted at the top of the blog
- **Categories and meal types control the filter buttons.** Stick to the values listed above so filtering works
- **No HTML needed.** Just edit the JSON files and the pages update automatically
