# Content Management Guide

You have two ways to manage content: the **Admin Panel (Decap CMS)** or **editing JSON files directly**.

---

## Option 1: Admin Panel (Recommended)

Go to `/admin/` on your site (e.g., `https://yoursite.com/admin/`) to access the content manager.

From the admin panel you can:
- Create, edit, and delete blog posts using a rich markdown editor
- Create, edit, and delete recipes with structured form fields
- Preview content before publishing
- All changes are saved as git commits automatically

### Setup Requirements

The admin panel uses **Decap CMS** with the `git-gateway` backend. To enable it:

1. Deploy your site to **Netlify**
2. Enable **Netlify Identity** (Site Settings > Identity > Enable)
3. Enable **Git Gateway** (Site Settings > Identity > Services > Git Gateway > Enable)
4. Invite yourself as a user via Netlify Identity
5. Visit `/admin/` and log in

---

## Option 2: Edit JSON Files Directly

### Adding a New Blog Post

Open `data/posts.json` and add a new object inside the `"posts"` array. Post bodies use **markdown**.

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
  "body": "Your opening paragraph here.\n\n## Section Heading\n\nMore content here.\n\n- Item one\n- Item two\n- Item three"
}
```

#### Blog Post Fields

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
| `body` | Yes | Markdown string (see below) |

#### Markdown Body Syntax

```
This is a paragraph. Just write normally.

## This Is a Heading

Another paragraph here.

- Bullet point one
- Bullet point two
- Bullet point three

Use **bold** and *italic* for emphasis.
```

---

### Adding a New Recipe

Open `data/recipes.json` and add a new object inside the `"recipes"` array:

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

#### Recipe Fields

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
├── site.js             — Shared JavaScript module
├── admin/
│   ├── index.html      — Decap CMS admin panel
│   └── config.yml      — CMS configuration
└── data/
    ├── posts.json      — All blog post content
    └── recipes.json    — All recipe content
```

## Tips

- **IDs must be unique.** Use lowercase with hyphens: `my-new-post`, `chicken-stir-fry`
- **Dates control sort order.** Newest posts appear first on the blog
- **Only one featured post.** Set `featured: true` on the one you want highlighted at the top of the blog
- **Categories and meal types control the filter buttons.** Stick to the values listed above so filtering works
- **Using the admin panel is easiest.** It handles markdown editing, form validation, and git commits for you
