from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# =========================
# LOAD MODEL FILES
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

restaurants_path = os.path.join(BASE_DIR, 'models', 'restaurants.pkl')

restaurants = pickle.load(open(restaurants_path, 'rb'))

# Build the vectorizer and sparse matrix at startup (memory-efficient)
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(restaurants['tags'])  # keep as sparse matrix — much smaller than full similarity

# Create index mapping (keep first occurrence of each name)
indices = pd.Series(restaurants.index, index=restaurants['name']).drop_duplicates()

# =========================
# PRE-COMPUTE FILTER OPTIONS
# =========================
# Extract all unique cuisines
all_cuisines = set()
restaurants['cuisines'].dropna().str.split(', ').apply(lambda x: all_cuisines.update(x))
all_cuisines.discard('')
CUISINE_LIST = sorted(all_cuisines)

# Extract all unique locations
LOCATION_LIST = sorted(restaurants['location'].dropna().unique().tolist())
if 'Unknown' in LOCATION_LIST:
    LOCATION_LIST.remove('Unknown')

# Cost range
COST_MIN = int(restaurants['cost'].min())
COST_MAX = int(restaurants['cost'].max())

# Budget brackets for dropdown
BUDGET_BRACKETS = [
    {"label": "Under ₹300", "min": 0, "max": 300},
    {"label": "₹300 – ₹500", "min": 300, "max": 500},
    {"label": "₹500 – ₹800", "min": 500, "max": 800},
    {"label": "₹800 – ₹1500", "min": 800, "max": 1500},
    {"label": "₹1500 – ₹3000", "min": 1500, "max": 3000},
    {"label": "Above ₹3000", "min": 3000, "max": 99999},
]

# Restaurant names for autocomplete dropdown
RESTAURANT_NAMES = sorted(restaurants['name'].drop_duplicates().tolist())


# =========================
# RECOMMEND FUNCTION
# =========================
def recommend(restaurant_name, cuisine_filter=None, location_filter=None, budget_min=None, budget_max=None):
    restaurant_name = restaurant_name.strip()

    if restaurant_name not in indices:
        return []

    idx = indices[restaurant_name]

    # Handle duplicate restaurant names — take first match
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]

    # Compute similarity only for this one restaurant (1 x N) — fast and memory-efficient
    sim_scores = cosine_similarity(vectors[idx], vectors).flatten()

    # Get top 51 (including itself), then skip the first (itself) — more results for post-filtering
    top_indices = np.argsort(sim_scores)[::-1][1:51]

    result = restaurants.iloc[top_indices].copy()

    # Apply filters
    if cuisine_filter and cuisine_filter != 'all':
        result = result[result['cuisines'].str.contains(cuisine_filter, case=False, na=False)]

    if location_filter and location_filter != 'all':
        result = result[result['location'] == location_filter]

    if budget_min is not None and budget_max is not None:
        result = result[(result['cost'] >= budget_min) & (result['cost'] <= budget_max)]

    # Return top 10 after filtering
    result = result.head(10)

    return result[['name', 'cuisines', 'Mean Rating', 'cost', 'location']].to_dict(orient='records')


# =========================
# ROUTES
# =========================

# Home Page
@app.route('/')
def home():
    return render_template('index.html')


# Recommendation Page (GET + POST)
@app.route('/recommend', methods=['GET', 'POST'])
def recommend_page():
    if request.method == 'POST':
        name = request.form.get('restaurant', '').strip()
        cuisine = request.form.get('cuisine', 'all')
        location = request.form.get('location', 'all')
        budget_idx = request.form.get('budget', '')

        budget_min = None
        budget_max = None
        if budget_idx and budget_idx != 'all':
            try:
                bi = int(budget_idx)
                if 0 <= bi < len(BUDGET_BRACKETS):
                    budget_min = BUDGET_BRACKETS[bi]['min']
                    budget_max = BUDGET_BRACKETS[bi]['max']
            except ValueError:
                pass

        if name == "":
            return render_template('web.html',
                                   results=[],
                                   error="Please select a restaurant name",
                                   cuisines=CUISINE_LIST,
                                   locations=LOCATION_LIST,
                                   budgets=BUDGET_BRACKETS,
                                   restaurant_names=RESTAURANT_NAMES)

        results = recommend(name, cuisine, location, budget_min, budget_max)

        if not results:
            return render_template('web.html',
                                   results=[],
                                   error="No recommendations found matching your filters. Try broadening your criteria.",
                                   name=name,
                                   cuisines=CUISINE_LIST,
                                   locations=LOCATION_LIST,
                                   budgets=BUDGET_BRACKETS,
                                   restaurant_names=RESTAURANT_NAMES,
                                   selected_cuisine=cuisine,
                                   selected_location=location,
                                   selected_budget=budget_idx)

        return render_template('web.html',
                               results=results,
                               name=name,
                               cuisines=CUISINE_LIST,
                               locations=LOCATION_LIST,
                               budgets=BUDGET_BRACKETS,
                               restaurant_names=RESTAURANT_NAMES,
                               selected_cuisine=cuisine,
                               selected_location=location,
                               selected_budget=budget_idx)

    return render_template('web.html',
                           results=None,
                           cuisines=CUISINE_LIST,
                           locations=LOCATION_LIST,
                           budgets=BUDGET_BRACKETS,
                           restaurant_names=RESTAURANT_NAMES)


# API: Restaurant names for autocomplete
@app.route('/api/restaurants')
def api_restaurants():
    query = request.args.get('q', '').lower().strip()
    if len(query) < 2:
        return jsonify([])
    matches = [n for n in RESTAURANT_NAMES if query in n.lower()][:20]
    return jsonify(matches)


# =========================
# RUN APP
# =========================
if __name__ == '__main__':
    app.run(debug=True)