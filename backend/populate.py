import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('listings.db')

# Create a cursor object to execute SQL commands
cur = conn.cursor()

# Create the listings table if it doesn't exist, with an image_url column
cur.execute('''
CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_type TEXT NOT NULL,
    location TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    price INTEGER NOT NULL,
    amenities TEXT,
    image_url TEXT
)
''')

# Insert dummy data into the listings table, including relevant image URLs
dummy_data = [
    ('house', 'Chicago', 2, 1, 300000, 'garage, pool', 'https://cdn.onekindesign.com/wp-content/uploads/2016/02/Traditional-Home-Interior-Michael-Abrams-01-1-Kindesign.jpg'),
    ('apartment', 'New York', 3, 2, 500000, 'garden, balcony', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=400&q=80'),
    ('house', 'Los Angeles', 4, 3, 800000, 'garage, garden, pool', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80'),
    ('house', 'San Francisco', 3, 2, 750000, 'pool, rooftop', 'https://media.houseandgarden.co.uk/photos/642c2fc3367ef34adc530147/master/w_1600%2Cc_limit/210708_Lauren_Weiss_Union_Street9032-production_digital.jpg'),
    ('apartment', 'Boston', 2, 1, 350000, 'garage, gym', 'https://landedinteriors.com/wp-content/uploads/2019/04/LKL-Willow_1-1-1120x747.jpg')
]

cur.executemany('''
INSERT INTO listings (property_type, location, bedrooms, bathrooms, price, amenities, image_url)
VALUES (?, ?, ?, ?, ?, ?, ?)
''', dummy_data)

# Commit the transaction and close the connection
conn.commit()
conn.close()

print("Database populated successfully with appropriate image URLs!")
