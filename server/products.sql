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
  sale_price INT,
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
  thumbnail_url TEXT NOT NULL
);

-- INDEXING
CREATE INDEX product_id_idx ON product (id);
CREATE INDEX features_id_idx ON features (id);
CREATE INDEX features_fk_id_idx ON features (product_id);
CREATE INDEX related_id_idx ON related (id);
CREATE INDEX related_fk_id_idx ON related (current_product_id);
CREATE INDEX styles_idx ON styles (id);
CREATE INDEX styles_fk_id_idx ON styles (productId);
CREATE INDEX photos_id_idx ON photos (id);
CREATE INDEX photos_fk_id_idx ON photos (styleID);
CREATE INDEX skus_id_idx ON skus (id);
CREATE INDEX skus_fk_id_idx ON skus (styleID);

-- ETL
COPY product(id, name, slogan, description, category, default_price)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/product.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY related(id, current_product_id, related_product_id)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/related.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY features(id, product_id, feature, value)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/features.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY styles(id, productId, name, sale_price, original_price, default_style)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/styles.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY skus(id, styleID, size, quantity)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/skus.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY photos(id, styleID, url, thumbnail_url)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/photos.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;