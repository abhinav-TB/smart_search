# populate_database.py
import sqlite3

def setup_database():
    conn = sqlite3.connect('real_estate.db')
    cursor = conn.cursor()
    
    # Create the table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_type TEXT,
        location TEXT,
        bedrooms INTEGER,
        bathrooms INTEGER,
        price INTEGER,
        amenities TEXT
    )
    ''')
    
    # Insert dummy data
    cursor.executemany('''
    INSERT INTO listings (property_type, location, bedrooms, bathrooms, price, amenities)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', [
        ('house', 'Chicago', 2, 1, 350000, 'garage, pool'),
        ('house', 'Chicago', 3, 2, 450000, 'garage, pool, fireplace'),
        ('apartment', 'Chicago', 2, 2, 250000, 'gym, pool'),
        ('house', 'New York', 2, 2, 500000, 'garage')
    ])
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    setup_database()
    print("Database populated with dummy data.")
