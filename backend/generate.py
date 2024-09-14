# generate_query_and_test.py
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

# Function to generate SQL query from natural language using the OpenAI API
def generate_sql_query(user_query):
    # Define the messages structure for the Chat API
    messages = [
        {"role": "system", "content": "You are a helpful assistant that converts natural language queries into SQL queries."},
        {"role": "user", "content": f'Convert the following natural language query into a SQL query that searches for house listings in a real estate database. Provide only the SQL query with no additional text or formatting:\n\n"{user_query}"\n\nHere is an example database schema:\n- Table: listings\n  - Fields:\n    - property_type (varchar)\n    - location (varchar)\n    - bedrooms (int)\n    - bathrooms (int)\n    - price (int)\n    - amenities (text)\n\nSQL Query:'}
    ]
    
    # Send the request to OpenAI API using the ChatCompletion method
    response = client.chat.completions.create(
        messages=messages,
        model="gpt-3.5-turbo",
        temperature=0.3,
        max_tokens=150
    )
    
    # Extract the SQL query from the response
    generated_sql = response.choices[0].message.content.strip()
    
    return generated_sql

# Function to execute SQL query and fetch results
def execute_query(sql_query):
    conn = sqlite3.connect('real_estate.db')
    cursor = conn.cursor()
    
    # Execute the generated SQL query
    cursor.execute(sql_query)
    results = cursor.fetchall()
    
    conn.close()
    return results

# Test the function with a sample query
if __name__ == "__main__":
    user_query = "Find me a 2-bedroom house in Chicago under $400k with a garage and a pool."
    sql_query = generate_sql_query(user_query)
    print("Generated SQL Query:\n", sql_query)
    
    results = execute_query(sql_query)
    print("Query Results:\n", results)
