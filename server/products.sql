-- Connect to DB and create schema
CREATE DATABASE IF NOT EXISTS products;
\c products;

CREATE TABLE IF NOT EXISTS product(
  id SERIAL PRIMARY KEY,
  name VARCHAR(155) NOT NULL,
  slogan VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  default_price INT
);

CREATE TABLE IF NOT EXISTS related(
  id SERIAL PRIMARY KEY,
  current_product_id INT REFERENCES product (id),
  related_product_id INT
);

CREATE TABLE IF NOT EXISTS features(
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES product (id),
  feature VARCHAR(100) NOT NULL,
  value VARCHAR(155) NOT NULL
);

CREATE TABLE IF NOT EXISTS styles(
  id SERIAL PRIMARY KEY,
  productId INT REFERENCES product (id),
  name VARCHAR(155) NOT NULL,
  sale_price INTEGER,
  original_price INT,
  default_style BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS skus(
  id SERIAL PRIMARY KEY,
  styleID INT REFERENCES styles (id),
  size VARCHAR(8) NOT NULL,
  quantity INT
);

CREATE TABLE IF NOT EXISTS photos(
  id SERIAL PRIMARY KEY,
  styleID INT REFERENCES styles (id),
  url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL
);

-- ETL
-- COPY product(id, name, slogan, description, category, default_price)
--   FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/product.csv'
--   DELIMITER ',' CSV HEADER;

COPY related(id, current_product_id, related_product_id)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/related.csv'
  DELIMITER ',' CSV HEADER;

COPY features(id, product_id, feature, value)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/features.csv'
  DELIMITER ',' CSV HEADER;