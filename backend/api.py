from flask import Flask, request, jsonify
import os
import sqlite3
import numpy as np
from gensim.models import KeyedVectors
from gensim.utils import simple_preprocess
from scipy.spatial.distance import cosine
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

# Load environment variables from .env file
load_dotenv()

# Load pre-trained Word2Vec model (you may need to download it)
model_path = './GoogleNews-vectors-negative300.bin'
word2vec_model = KeyedVectors.load_word2vec_format(model_path, binary=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def preprocess(text):
    return simple_preprocess(text, deacc=True)

def vectorize(text, model):
    words = preprocess(text)
    word_vectors = [model[word] for word in words if word in model]
    if not word_vectors:
        return np.zeros(model.vector_size)
    return np.mean(word_vectors, axis=0)

def find_similar_items(user_query, limit=5):
    conn = sqlite3.connect('listings.db')
    cursor = conn.cursor()

    # Fetch all rows from the listings table
    cursor.execute("SELECT * FROM listings")
    items = cursor.fetchall()
    conn.close()

    query_vector = vectorize(user_query, word2vec_model)
    results = []

    # Dynamically handle the number of columns based on the table's structure
    for item in items:
        item_id, property_type, location, bedrooms, bathrooms, price, amenities, image_url, nearby_attractions, year_built, property_status, square_footage, number_of_floors, parking_spaces, construction_material, heating_cooling_systems, monthly_hoa_fee, pet_policy = item

        # Combine all relevant fields for similarity comparison
        item_text = f"{property_type} {location} {amenities} {nearby_attractions} {construction_material} {heating_cooling_systems} {property_status} {pet_policy}"
        item_vector = vectorize(item_text, word2vec_model)
        similarity = 1 - cosine(query_vector, item_vector)

        # Append the result with all fields
        results.append({
            'item_id': item_id,
            'property_type': property_type,
            'location': location,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'price': price,
            'amenities': amenities,
            'image_url': image_url,
            'nearby_attractions': nearby_attractions,
            'year_built': year_built,
            'property_status': property_status,
            'square_footage': square_footage,
            'number_of_floors': number_of_floors,
            'parking_spaces': parking_spaces,
            'construction_material': construction_material,
            'heating_cooling_systems': heating_cooling_systems,
            'monthly_hoa_fee': monthly_hoa_fee,
            'pet_policy': pet_policy,
            'similarity': float(similarity)  # Convert numpy float to Python float
        })

    results.sort(key=lambda x: x['similarity'], reverse=True)
    return results[:limit]


@app.route('/search', methods=['POST'])
def search():
    data = request.json
    user_query = data.get('query')
    limit = data.get('limit', 5)  # Default to 5 items if not provided
    if not user_query:
        return jsonify({'error': 'Query parameter is missing'}), 400

    results = find_similar_items(user_query, limit)
    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
