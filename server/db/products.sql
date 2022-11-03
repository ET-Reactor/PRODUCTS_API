COPY product(id, name, slogan, description, category, default_price)
  FROM '/Users/curtiswang/projects/Hack Reactor/Immersive/SDC/PRODUCTS_API/data/product.csv'
  DELIMITER ',' CSV HEADER;