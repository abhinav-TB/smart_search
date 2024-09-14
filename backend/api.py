from flask import Flask, request, jsonify
import os
import sqlite3
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client with your API key
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

app = Flask(__name__)

def generate_sql_query(user_query):
    messages = [
        {"role": "system", "content": "You are a helpful assistant that converts natural language queries into SQL queries."},
        {"role": "user", "content": f'Convert the following natural language query into a SQL query that searches for house listings in a real estate database. Provide only the SQL query with no additional text or formatting:\n\n"{user_query}"\n\nHere is an example database schema:\n- Table: listings\n  - Fields:\n    - property_type (varchar)\n    - location (varchar)\n    - bedrooms (int)\n    - bathrooms (int)\n    - price (int)\n    - amenities (text)\n\nSQL Query:'}
    ]
    
    response = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo",
        temperature=0.3,
        max_tokens=150
    )
    
    generated_sql = response.choices[0].message.content.strip()
    
    return generated_sql

def execute_query(sql_query):
    conn = sqlite3.connect('real_estate.db')
    cursor = conn.cursor()
    
    cursor.execute(sql_query)
    results = cursor.fetchall()
    
    conn.close()
    return results

@app.route('/generate-query', methods=['POST'])
def api_generate_query():
    data = request.json
    user_query = data.get('query')
    if not user_query:
        return jsonify({'error': 'Query parameter is missing'}), 400
    
    sql_query = generate_sql_query(user_query)
    return jsonify({'sql_query': sql_query})

@app.route('/execute-query', methods=['POST'])
def api_execute_query():
    data = request.json
    sql_query = data.get('sql_query')
    if not sql_query:
        return jsonify({'error': 'SQL query parameter is missing'}), 400
    
    results = execute_query(sql_query)
    return jsonify({'results': results})

if __name__ == '__main__':
    app.run(debug=True)
