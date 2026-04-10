# restaurant-recommendation-system
# Restaurant Recommender System

A Flask-based web application that recommends restaurants similar to a user-selected restaurant using a content-based filtering approach. The project uses cleaned restaurant metadata, converts textual features into vectors with `CountVectorizer`, and ranks similar restaurants with cosine similarity.

## Overview

This project demonstrates an end-to-end machine learning workflow for restaurant recommendations:

- Data preparation from a large Zomato dataset
- Feature engineering using cuisine and restaurant type metadata
- Model artifact generation in a Jupyter notebook
- A lightweight Flask web interface for interactive recommendations

The current application loads a preprocessed restaurant dataset from `models/restaurants.pkl`, builds the text vector space at startup, and computes similarity only when a user submits a restaurant name.

## Key Features

- Content-based recommendation pipeline
- Flask web application with separate home and recommendation pages
- Input validation on both client and server sides
- Memory-conscious runtime design that avoids loading the large precomputed similarity matrix
- Simple HTML, CSS, and JavaScript frontend for quick local deployment

## How It Works

1. The notebook reads `data/zomato.csv`.
2. It selects and cleans the restaurant metadata columns.
3. It combines `cuisines` and `rest_type` into a `tags` field.
4. `CountVectorizer` transforms the tags into feature vectors.
5. At runtime, the app computes cosine similarity between the selected restaurant and all other restaurants.
6. The top similar restaurants are returned with cuisine, rating, and cost information.

## Tech Stack

- Python
- Flask
- Pandas
- NumPy
- scikit-learn
- Jupyter Notebook
- HTML / CSS / JavaScript

## Project Structure

```text
restaurant-recommender-system/
|-- app.py                  # Flask application entry point
|-- requirements.txt        # Python dependencies
|-- README.md               # Project documentation
|-- data/
|   `-- zomato.csv          # Source dataset
|-- models/
|   |-- restaurants.pkl     # Preprocessed restaurant records used by the app
|   `-- similarity.pkl      # Legacy precomputed similarity matrix (very large)
|-- notebooks/
|   `-- model.ipynb         # Data cleaning and model-building notebook
|-- static/
|   |-- css/main.css        # Styles
|   |-- js/main.js          # Client-side validation and loading state
|   `-- images/             # UI assets
`-- templates/
    |-- index.html          # Landing page
    `-- web.html            # Recommendation form and results page
```

## Dataset and Model Artifacts

### Dataset

- Source file: `data/zomato.csv`
- The dataset is relatively large and may not be ideal for lightweight repository hosting if bandwidth or clone size is a concern.

### Model Files

- `models/restaurants.pkl` is the primary artifact used by the Flask app.
- `models/similarity.pkl` is generated in the notebook, but the current application does not use it.
- Because `similarity.pkl` is several gigabytes in size, it is better treated as an optional offline artifact instead of a required runtime dependency.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/restaurant-recommender-system.git
cd restaurant-recommender-system
```

### 2. Create and activate a virtual environment

On Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

On macOS/Linux:

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

Start the Flask server with:

```bash
python app.py
```

Then open your browser and visit:

```text
http://127.0.0.1:5000/
```

## Usage

1. Open the home page.
2. Navigate to the recommendation page.
3. Enter a restaurant name available in the trained dataset.
4. Submit the form.
5. Review the top recommended restaurants shown in the results table.

## Application Flow

### Training / Artifact Generation

The notebook in `notebooks/model.ipynb` performs:

- dataset loading
- column selection and renaming
- missing-value handling
- cost and rating normalization
- tag generation from `cuisines` and `rest_type`
- vectorization with `CountVectorizer`
- serialization of `restaurants.pkl` and `similarity.pkl`

### Runtime Recommendation Logic

The Flask app in `app.py` performs:

- loading `restaurants.pkl`
- rebuilding the vectorizer and sparse feature matrix at startup
- mapping restaurant names to dataframe indices
- computing cosine similarity for the requested restaurant only
- returning the top 10 similar restaurants

## Current Endpoints

| Route | Method | Description |
|------|--------|-------------|
| `/` | `GET` | Landing page |
| `/recommend` | `GET` | Recommendation form page |
| `/recommend` | `POST` | Returns recommendation results for the submitted restaurant |

## Example Recommendation Output

Each recommendation record includes:

- Restaurant name
- Cuisines
- Mean rating
- Approximate cost

## Known Limitations

- Recommendations depend only on cuisine and restaurant type tags.
- Restaurant-name matching is exact; partial matching and typo tolerance are not implemented.
- The application does not currently expose an API layer despite `FastAPI` and `uvicorn` appearing in `requirements.txt`.
- Some frontend files contain encoding artifacts that may need cleanup for production presentation.
- `debug=True` is enabled in `app.py`, which is suitable for development but not for production deployment.

## Suggested Improvements

- Add fuzzy search or autocomplete for restaurant names
- Remove unused dependencies from `requirements.txt`
- Add a proper production configuration for Flask
- Exclude or externally host oversized artifacts such as `data/zomato.csv` and `models/similarity.pkl`
- Add screenshots or a demo GIF in the README
- Add unit tests for recommendation logic and route behavior
- Provide Docker support and environment-based configuration

## Requirements Notes

The current `requirements.txt` includes a duplicated `scikit-learn` entry and packages that are not used by the Flask app at runtime. If you plan to publish this repository, consider trimming dependencies to only what is required for training and serving.

## Future Scope

- Personalized recommendations using user preferences
- Hybrid recommendation models
- Ranking by location, budget, or cuisine filters
- REST API support for frontend or mobile clients
- Deployment to a cloud platform

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

Add your preferred license here, for example `MIT`, `Apache-2.0`, or a custom academic/project license.

## Author
Eldrich Domnick Victoria