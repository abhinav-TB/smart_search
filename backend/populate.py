import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('listings.db')

# Create a cursor object to execute SQL commands
cur = conn.cursor()

# Create the listings table if it doesn't exist
cur.execute('''
CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_type TEXT NOT NULL,
    location TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    price INTEGER NOT NULL,
    amenities TEXT
)
''')

# Insert dummy data into the listings table
dummy_data = [
    ('house', 'Chicago', 2, 1, 300000, 'garage, pool'),
    ('apartment', 'New York', 3, 2, 500000, 'garden, balcony'),
    ('house', 'Los Angeles', 4, 3, 800000, 'garage, garden, pool'),
    ('house', 'San Francisco', 3, 2, 750000, 'pool, rooftop'),
    ('apartment', 'Boston', 2, 1, 350000, 'garage, gym')
]

cur.executemany('''
INSERT INTO listings (property_type, location, bedrooms, bathrooms, price, amenities)
VALUES (?, ?, ?, ?, ?, ?)
''', dummy_data)

# Commit the transaction and close the connection
conn.commit()
conn.close()

print("Database populated successfully!")
