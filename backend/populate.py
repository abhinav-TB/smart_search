import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('listings.db')

# Create a cursor object to execute SQL commands
cur = conn.cursor()

# Create the listings table with additional parameters
cur.execute('''
CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_type TEXT NOT NULL,
    location TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    price INTEGER NOT NULL,
    amenities TEXT,
    image_url TEXT,
    nearby_attractions TEXT,
    year_built INTEGER,
    property_status TEXT,
    square_footage INTEGER,
    number_of_floors INTEGER,
    parking_spaces INTEGER,
    construction_material TEXT,
    heating_cooling_systems TEXT,
    monthly_hoa_fee INTEGER,
    pet_policy TEXT
)
''')

# Insert dummy data into the listings table, including new parameters
dummy_data = [
    ('house', 'Chicago', 2, 1, 300000, 'garage, pool', 'https://cdn.onekindesign.com/wp-content/uploads/2016/02/Traditional-Home-Interior-Michael-Abrams-01-1-Kindesign.jpg', 'Museum, Park', 1995, 'available', 1500, 2, 2, 'brick', 'central air', 200, 'allowed'),
    ('apartment', 'New York', 3, 2, 500000, 'garden, balcony', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=400&q=80', 'Broadway, Central Park', 2010, 'sold', 1200, 1, 1, 'concrete', 'window units', 0, 'not allowed'),
    ('house', 'Los Angeles', 4, 3, 800000, 'garage, garden, pool', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80', 'Hollywood, Beach', 2005, 'under contract', 2200, 3, 3, 'stucco', 'central air', 300, 'allowed'),
    ('house', 'San Francisco', 3, 2, 750000, 'pool, rooftop', 'https://media.houseandgarden.co.uk/photos/642c2fc3367ef34adc530147/master/w_1600%2Cc_limit/210708_Lauren_Weiss_Union_Street9032-production_digital.jpg', 'Golden Gate Bridge, Park', 1990, 'available', 1800, 2, 2, 'wood', 'central heating', 250, 'allowed'),
    ('apartment', 'Boston', 2, 1, 350000, 'garage, gym', 'https://landedinteriors.com/wp-content/uploads/2019/04/LKL-Willow_1-1-1120x747.jpg', 'Historical Sites, Universities', 2015, 'available', 950, 1, 1, 'brick', 'window units', 0, 'allowed'),
    ('condo', 'Miami', 1, 1, 200000, 'pool, gym', 'https://images.homes.com/listings/116/1048101983-386913181/3600-n-lake-shore-dr-chicago-il-unit-609.jpg', 'Beach, Nightlife', 2020, 'available', 700, 1, 1, 'concrete', 'central air', 150, 'not allowed'),
    ('loft', 'Austin', 2, 2, 450000, 'open space, rooftop', 'https://images.unsplash.com/photo-1506748686214e9df14c1d3c7?auto=format&fit=crop&w=500&q=80', 'Music Venues, Parks', 2018, 'sold', 1200, 2, 2, 'metal', 'central air', 100, 'allowed'),
    ('villa', 'San Diego', 5, 4, 1200000, 'pool, spa', 'https://images.homes.com/listings/116/5820985093-089228181/southview-condominiums-roanoke-va-unit-405-7.jpg', 'Zoo, Beach', 2000, 'under contract', 3500, 3, 4, 'stone', 'central air and heating', 500, 'allowed'),
    ('townhouse', 'Seattle', 3, 2, 650000, 'garden, home office', 'https://images.homes.com/listings/116/4259029393-167398381/2826-n-talman-ave-chicago-il-unit-m.jpg', 'Pike Place Market, Waterfront', 1998, 'available', 1600, 2, 2, 'wood', 'central heating', 200, 'allowed'),
    ('studio', 'Philadelphia', 1, 1, 180000, 'rooftop access', 'https://images.homes.com/listings/116/6485748393-093468381/2516-w-iowa-st-chicago-il-unit-3.jpg', 'Historic District', 2021, 'available', 500, 1, 0, 'steel', 'central air', 50, 'allowed'),
    ('duplex', 'Atlanta', 4, 3, 550000, 'large backyard, two-car garage', 'https://images.homes.com/listings/116/0359029393-167398381/2826-n-talman-ave-chicago-il-unit-m-4.jpg', 'City Park, Museum', 2008, 'available', 2200, 2, 2, 'vinyl', 'central heating', 200, 'allowed'),
    ('cabin', 'Asheville', 3, 2, 350000, 'mountain views, fireplace', 'https://images.unsplash.com/photo-1506748686214-9b5e1f2c2a0b?auto=format&fit=crop&w=500&q=80', 'National Park', 1995, 'available', 1200, 1, 1, 'wood', 'wood stove', 0, 'allowed'),
    ('farmhouse', 'Nashville', 5, 4, 700000, 'barn, pasture', 'https://images.homes.com/listings/116/6472682093-118607181/6144-n-keystone-ave-chicago-il.jpg', 'Rural Area', 1985, 'under contract', 3500, 2, 4, 'brick', 'central air', 300, 'allowed'),
    ('apartment', 'San Jose', 2, 2, 400000, 'balcony, gym', 'https://images.homes.com/listings/116/8966678393-840678381/659-w-randolph-st-chicago-il-unit-917.jpg', 'Tech Hub', 2012, 'sold', 950, 1, 1, 'concrete', 'central air', 100, 'not allowed'),
    ('penthouse', 'Las Vegas', 3, 3, 900000, 'luxury amenities, private pool', 'https://images.homes.com/listings/116/7517018883-980541181/1700-e-56th-st-chicago-il-unit-3002.jpg', 'Strip, Casinos', 2018, 'available', 2500, 1, 3, 'glass', 'central air', 400, 'allowed'),
    ('loft', 'Denver', 2, 2, 475000, 'open floor plan, mountain views', 'https://images.homes.com/listings/116/3610476393-393867381/one-river-place-chicago-il-unit-501-4.jpg', 'Downtown', 2015, 'available', 1300, 1, 1, 'brick', 'central heating', 200, 'allowed')
]

cur.executemany('''
INSERT INTO listings (property_type, location, bedrooms, bathrooms, price, amenities, image_url, nearby_attractions, year_built, property_status, square_footage, number_of_floors, parking_spaces, construction_material, heating_cooling_systems, monthly_hoa_fee, pet_policy)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', dummy_data)

# Commit the transaction and close the connection
conn.commit()
conn.close()

print("Database populated successfully with a large set of diverse data!")