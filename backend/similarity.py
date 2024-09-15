import os
import sqlite3
import numpy as np
from gensim.models import KeyedVectors
from gensim.utils import simple_preprocess
from scipy.spatial.distance import cosine
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load pre-trained Word2Vec model (you may need to download it)
model_path = './GoogleNews-vectors-negative300.bin'
word2vec_model = KeyedVectors.load_word2vec_format(model_path, binary=True)

def preprocess(text):
    return simple_preprocess(text, deacc=True)

def vectorize(text, model):
    words = preprocess(text)
    word_vectors = [model[word] for word in words if word in model]
    if not word_vectors:
        return np.zeros(model.vector_size)
    return np.mean(word_vectors, axis=0)

def find_similar_items(user_query):
    conn = sqlite3.connect('listings.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM listings")
    items = cursor.fetchall()
    conn.close()

    query_vector = vectorize(user_query, word2vec_model)
    results = []

    for item in items:
        item_id, property_type, location, bedrooms, bathrooms, price, amenities, image_url = item
        item_text = f"{property_type} {location} {amenities}"
        item_vector = vectorize(item_text, word2vec_model)
        similarity = 1 - cosine(query_vector, item_vector)
        results.append((item, similarity))

    results.sort(key=lambda x: x[1], reverse=True)
    return results

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Find and rank similar house listings based on natural language input.")
    parser.add_argument('query', type=str, help="Natural language query to find similar items.")
    
    args = parser.parse_args()
    user_query = args.query

    print("Finding similar items...")
    results = find_similar_items(user_query)
    if results:
        print("Ranked Results:")
        for item, similarity in results:
            print(f"Similarity: {similarity:.4f} - {item}")
    else:
        print("No results found.")

if __name__ == '__main__':
    main()

