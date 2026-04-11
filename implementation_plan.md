# Restaurant Recommender System — UI Overhaul & Filter Features

## Goal
Transform the current simple, white-background Flask UI into a premium, dark-themed experience with rotating food image cards and powerful filtering (cuisine, locality, budget).

---

## Proposed Changes

### 1. Data Pipeline — Add Location Data to Pickle

The current `restaurants.pkl` only has `['name', 'cuisines', 'Mean Rating', 'cost', 'tags']`. The original CSV (`zomato.csv`) has a `location` column with **93 unique localities** (Bangalore neighborhoods). We need to rebuild the pickle to include `location`.

#### [MODIFY] [app.py](file:///d:/restaurant-recommender-system/app.py)
- Add a startup step to load and merge `location` data from the CSV into the restaurants DataFrame
- Add a `/api/filters` endpoint returning available cuisines, locations, and cost range as JSON
- Modify `recommend()` to accept optional filters: `cuisine`, `location`, `max_budget`
- Post-filter recommendations by the selected criteria
- Add an `/api/restaurants` endpoint for autocomplete suggestions

---

### 2. Premium UI Redesign

Complete overhaul of both pages with a modern dark theme.

#### [MODIFY] [main.css](file:///d:/restaurant-recommender-system/static/css/main.css)
- **Dark theme**: Deep charcoal background (#0f0f14) with warm accent colors (amber/gold #f59e0b)
- **Glassmorphism**: Semi-transparent card backgrounds with backdrop blur
- **Modern typography**: Google Fonts (Inter for body, Playfair Display for headings)
- **Smooth gradients & glow effects**: Subtle amber/orange gradients on buttons and accents
- **Micro-animations**: Fade-ins, hover lifts, shimmer loading states
- **Result cards** instead of plain table — each recommendation as a beautiful glass card
- **Responsive design**: Mobile-first with elegant breakpoints

#### [MODIFY] [index.html](file:///d:/restaurant-recommender-system/templates/index.html)
- Add Google Fonts import
- Add meta viewport tag for responsiveness
- Restructure hero section with animated text and rotating image carousel
- Add "How It Works" section with step icons
- Add footer

#### [MODIFY] [web.html](file:///d:/restaurant-recommender-system/templates/web.html)
- Add filter panel (cuisine dropdown, locality dropdown, budget slider)
- Replace table with responsive card grid for results
- Each card shows: restaurant name, cuisines as tags, rating with stars, cost
- Add animated loading skeleton while fetching
- Add "no results" illustration state

---

### 3. Image Carousel

5 AI-generated food images have already been created and placed in `static/images/`:
- `food_curry.png` — Indian curry
- `food_pizza.png` — Wood-fired pizza
- `food_dimsum.png` — Chinese dim sum
- `food_burger.png` — Gourmet burger
- `food_dessert.png` — Chocolate dessert

#### [MODIFY] [main.js](file:///d:/restaurant-recommender-system/static/js/main.js)
- Auto-rotating carousel with smooth crossfade (4-second interval)
- Dot indicators showing current slide
- Pause on hover, resume on mouse leave

---

### 4. Filters

Three filters on the recommendation page:

| Filter | Type | Source |
|--------|------|--------|
| **Cuisine** | Multi-select dropdown | 108 unique cuisines parsed from `cuisines` column |
| **Locality** | Searchable dropdown | 93 locations from the CSV `location` column |
| **Budget** | Range slider | ₹0 – ₹6000 (based on cost range in data) |

Filters are applied **after** the recommendation engine runs, narrowing down the 10 results to only those matching the criteria. If no results match, a friendly message is shown.

> [!IMPORTANT]
> The locality data is NOT in the current `restaurants.pkl`. We need to load it from the CSV at startup and merge it into the DataFrame. This adds ~1-2 seconds to startup but avoids needing to rebuild the pickle file.

---

## User Review Required

> [!WARNING]
> The locality data comes from the original Zomato CSV (574 MB). Loading it at startup to extract locations will add a brief delay. An alternative is to rebuild the pickle with location included — but that requires re-running the model notebook. **Which approach do you prefer?**

> [!IMPORTANT]
> The current recommendation system returns 10 results. After applying filters, the count may be lower. Should we increase the initial recommendation count (e.g., 50) before filtering to ensure enough results?

---

## Verification Plan

### Automated Tests
- Run the Flask app and verify both pages load
- Test the recommendation endpoint with and without filters
- Verify the carousel cycles through all 5 images

### Manual Verification
- Open the app in browser and take screenshots
- Verify responsive layout on different viewport sizes
- Test all three filters individually and in combination
