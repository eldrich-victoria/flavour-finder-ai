# 🍽️ Flavour Finder — Restaurant Recommendation System

A full-stack web application that recommends restaurants similar to a user-selected restaurant using **content-based filtering**. Built on ~50,000 Bangalore restaurant listings from the Zomato dataset, the system uses NLP-based vectorization (`CountVectorizer`) and **cosine similarity** to find the closest matches — with optional filtering by cuisine, locality, and budget.

## ✨ Key Features

- **Content-based recommendation engine** — finds restaurants with similar cuisines and dining styles
- **Smart search** — searchable dropdown with type-to-filter for 50,000+ restaurant names
- **Advanced filters** — narrow results by cuisine type, Bangalore locality, and budget range
- **Memory-efficient design** — computes similarity on-the-fly instead of loading a 4 GB precomputed matrix
- **Premium dark UI** — glassmorphism, micro-animations, food image carousel, and card-based results
- **Fully responsive** — optimized layouts for desktop, tablet, and mobile
- **Client + server validation** — input checking on both sides with user-friendly error states

## 🧠 How It Works

### Training Phase (Notebook)

1. Load the raw Zomato dataset (`data/zomato.csv`)
2. Select and clean relevant columns: `name`, `cuisines`, `rate`, `cost`, `rest_type`, `location`
3. Engineer a `tags` feature by combining `cuisines` + `rest_type` (lowercased)
4. Vectorize the tags using `CountVectorizer` with 5,000 features and English stop-word removal
5. Serialize the cleaned DataFrame as `models/restaurants.pkl`

### Runtime Phase (Flask App)

1. Load `restaurants.pkl` at startup
2. Rebuild the vectorizer and sparse feature matrix in memory
3. Pre-compute all filter dropdown options (cuisines, locations, budget brackets)
4. On user request, compute cosine similarity for **only the selected restaurant** (1×N operation)
5. Apply user-selected filters, return the top 10 matching restaurants

## 📊 Exploratory Data Analysis

The EDA notebook (`notebooks/eda.ipynb`) reveals key dataset insights:

- **North Indian** is the most common cuisine (~20,000 listings), followed by Chinese and South Indian
- Restaurant ratings follow a roughly normal distribution centered around **3.7/5.0**
- Top-rated restaurants score **4.8–4.9** out of 5.0
- **Cafe Coffee Day** is the most frequently listed chain with 96 outlets across Bangalore

EDA visualizations are saved in the `visuals/` directory.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python, Flask |
| **ML/NLP** | scikit-learn (`CountVectorizer`, `cosine_similarity`), Pandas, NumPy |
| **Frontend** | HTML5, CSS3 (custom dark theme), Vanilla JavaScript |
| **Fonts** | Inter, Playfair Display (Google Fonts) |
| **EDA** | Jupyter Notebook, Matplotlib, Seaborn |

## 📁 Project Structure

```text
restaurant-recommender-system/
├── app.py                      # Flask server — routes, recommendation logic, API
├── requirements.txt            # Python dependencies
├── README.md                   # Project documentation
│
├── data/
│   └── zomato.csv              # Source Zomato dataset (~574 MB)
│
├── models/
│   ├── restaurants.pkl         # Preprocessed restaurant DataFrame (used at runtime)
│   └── similarity.pkl          # Precomputed similarity matrix (legacy, not used at runtime)
│
├── notebooks/
│   ├── eda.ipynb               # Exploratory Data Analysis with visualizations
│   └── model.ipynb             # Data cleaning, feature engineering, model building
│
├── static/
│   ├── css/main.css            # Premium dark-theme design system (~970 lines)
│   ├── js/main.js              # Carousel, searchable select, form validation, scroll effects
│   └── images/                 # Food carousel images and UI assets
│
├── templates/
│   ├── index.html              # Landing page with hero section and carousel
│   └── web.html                # Recommendation form, filters, and results cards
│
└── visuals/                    # EDA chart outputs (cuisine frequency, ratings, etc.)
```

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/eldrich-victoria/flavour-finder-ai.git
cd restaurant-recommendation-system
```

### 2. Create and activate a virtual environment

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**macOS / Linux:**
```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Ensure model files exist

The app requires `models/restaurants.pkl` to run. If it's missing, regenerate it by running the `notebooks/model.ipynb` notebook (requires `data/zomato.csv`).

## ▶️ Running the Application

```bash
python app.py
```

Then open your browser and visit: **http://127.0.0.1:5000/**

## 📖 Usage

1. **Home page** → Browse the landing page with the food carousel and learn how the system works
2. **Recommend page** → Click "Get Recommendations" or navigate to `/recommend`
3. **Search** → Type at least 2 characters in the restaurant search box to filter the dropdown
4. **Filter** → Optionally narrow results by cuisine, Bangalore locality, or budget bracket
5. **Submit** → Click "Get Recommendations" to view the top 10 similar restaurants as styled cards
6. **Review** → Each card shows the restaurant name, cuisine tags, rating (color-coded), cost for two, and location

## 🔗 API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | `GET` | Landing page with hero section and food carousel |
| `/recommend` | `GET` | Recommendation form with search and filter dropdowns |
| `/recommend` | `POST` | Process form submission and return recommendation results |
| `/api/restaurants` | `GET` | JSON autocomplete API — accepts `?q=` query param (min 2 chars, returns top 20 matches) |

## 📋 Recommendation Output

Each recommendation card displays:

| Field | Description |
|-------|-------------|
| **Name** | Restaurant name |
| **Cuisines** | Up to 4 cuisine tags as pill badges |
| **Rating** | Mean rating out of 5.0 (green ≥ 3.8, amber ≥ 3.0, red < 3.0) |
| **Cost** | Approximate cost for two (₹) |
| **Location** | Bangalore locality |

## 🎨 Frontend Design

The UI features a premium dark-mode design system:

- **Color palette** — Deep black base (#0a0a0f) with amber/gold accents (#f59e0b)
- **Typography** — Playfair Display for headings, Inter for body text
- **Effects** — Glassmorphism panels, backdrop blur, glow shadows, gradient accents
- **Animations** — `fadeInUp` entrance animations, staggered card reveals, carousel crossfade, scroll-triggered step cards
- **Responsiveness** — Three breakpoints (1024px, 768px, 480px) for full device coverage

## ⚠️ Known Limitations

- Recommendations are based solely on cuisine and restaurant type tags — user preferences, reviews, and location proximity are not factored in
- Restaurant name matching requires an exact selection from the dropdown; free-text input with typos will not match
- The `similarity.pkl` file (4.2 GB) is generated by the notebook but is **not used** by the Flask app at runtime
- The application runs with `debug=True`, which is suitable for development but not for production deployment

## 🔮 Future Scope

- Hybrid recommendation model combining content-based and collaborative filtering
- User accounts with personalized recommendation history
- Location-aware recommendations using geolocation
- REST API layer for mobile app integration
- Deployment to a cloud platform (AWS, GCP, or Heroku)
- Docker containerization for portable deployment
- Unit and integration tests for recommendation logic and routes

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 👤 Author

**Eldrich Domnick Victoria**
