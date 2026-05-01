DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS items;
/* DROP TABLE IF EXISTS locations;*/
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
contact_number INTEGER, 
/* industry TEXT NOT NULL UNIQUE, (reference to ORGANIZATION table as a stretch goal) */
/* role TEXT NOT NULL DEFAULT 'employee', add as a stretch goal */
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*industry tag move to organization table - users table to have FK org_id - org table to have business naem, industry, */
/* database transaction - commit/rollback - start transaction, tell postgres everything we need to finish, in info lost - if something is missing - rollback*/

CREATE TABLE items (
id SERIAL PRIMARY KEY,
name TEXT UNIQUE NOT NULL, /* normalize input in items.js in QUERIES folder with either LOWER() or ILIKE */
description TEXT,
sku TEXT UNIQUE NOT NULL,
unit TEXT NOT NULL DEFAULT 'items e.g.(boxes, single unit, bottles, etc...)',
quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
low_stock_threshold INTEGER NOT NULL,
item_photo BYTEA, /* change data type to VARCHAR when image server is acquired */
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* CREATE TABLE locations (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
address TEXT
); (LOCATIONS TABLE AND FOREIGN KEYS ARE COMMENTED OUT, LOCATIONS ARE A STRETCH GOAL) */

CREATE TABLE inventory (
id SERIAL PRIMARY KEY,
item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
/* location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE */
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
UNIQUE (item_id, location_id)
);

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
supplier_name TEXT,
supplier_email TEXT UNIQUE,      /* keep simple for now (can normalize later)*/
status TEXT NOT NULL DEFAULT 'draft',     /* draft, submitted, received, complete */
created_by INTEGER REFERENCES users(id),
approved_by INTEGER REFERENCES users(id),    /* for your admin approval flow */
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
id SERIAL PRIMARY KEY,
order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
item_id INTEGER NOT NULL REFERENCES items(id),
quantity INTEGER NOT NULL CHECK (quantity > 0),
price NUMERIC(10, 2) NOT NULL,
UNIQUE (order_id, item_id)
);

CREATE TABLE inventory_transactions (
id SERIAL PRIMARY KEY,
item_id INTEGER NOT NULL REFERENCES items(id),
/* location_id INTEGER REFERENCES locations(id), */
quantity_change INTEGER NOT NULL,
reason TEXT NOT NULL, /* 'restock', 'sale', 'waste', 'adjustment' look into ENUM data type(data protection)*/
user_id INTEGER NOT NULL UNIQUE REFERENCES users(id)  ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
