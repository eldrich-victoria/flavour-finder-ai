from flask import Flask, render_template, request
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
# RECOMMEND FUNCTION
# =========================
def recommend(restaurant_name):
    restaurant_name = restaurant_name.strip()

    if restaurant_name not in indices:
        return []

    idx = indices[restaurant_name]

    # Handle duplicate restaurant names — take first match
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]

    # Compute similarity only for this one restaurant (1 x N) — fast and memory-efficient
    sim_scores = cosine_similarity(vectors[idx], vectors).flatten()

    # Get top 11 (including itself), then skip the first (itself)
    top_indices = np.argsort(sim_scores)[::-1][1:11]

    result = restaurants.iloc[top_indices]

    return result[['name', 'cuisines', 'Mean Rating', 'cost']].to_dict(orient='records')

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

        if name == "":
            return render_template('web.html', results=[], error="Please enter a restaurant name")

        results = recommend(name)

        if not results:
            return render_template('web.html', results=[], error="No recommendations found")

        return render_template('web.html', results=results, name=name)

    return render_template('web.html', results=None)


# =========================
# RUN APP
# =========================
if __name__ == '__main__':
    app.run(debug=True)