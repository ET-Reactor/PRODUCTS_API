const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async (productID, callback) => {
    try {
      const relatedResult = await pool.query(`
        SELECT
          jsonb_agg(related_product_id) AS rps
        FROM related
        WHERE current_product_id=$1
      `, [productID]);
      callback(null, relatedResult.rows[0].rps);
    } catch (error) {
      callback(error, null);
    }
  },

  getProduct: async (productID, callback) => {
    try {
      const productResult = await pool.query(`
        SELECT
          product.*,
          json_agg(json_build_object('feature', features.feature, 'value', features.value)) AS features
        FROM product
        LEFT JOIN features ON features.product_id=product.id
        GROUP BY product.id, features.product_id
        HAVING product_id=$1
      `, [productID]);
      callback(null, productResult.rows);
    } catch (error) {
      callback(error, null);
    }
  },

  getProducts: async (productsPage, productsCount, callback) => {
    try {
      const productsResult = await pool.query(`
        SELECT
          *
        FROM product
        ORDER BY product.id
        LIMIT $1 OFFSET (($2 - 1) * $1)
      `, [productsCount, productsPage]);
      callback(null, productsResult.rows);
    } catch (error) {
      callback(error, null);
    }
  },

  getStyles: async (productID, callback) => {
    try {
      const stylesResult = await pool.query(
        `SELECT
          styles.id AS style_id,
          styles.name,
          styles.original_price,
          COALESCE(styles.sale_price, 0) AS sale_price,
          styles.default_style AS "default?",
          jsonb_agg(distinct jsonb_build_object('url', photos.url, 'thumbnail_url', photos.thumbnail_url)) AS photos,
          jsonb_object_agg(COALESCE(CAST(skus.id AS VARCHAR), 'null'), jsonb_build_object('quantity', skus.quantity, 'size', skus.size)) AS skus
        FROM styles
        LEFT JOIN photos ON photos.styleid=styles.id
        LEFT JOIN skus ON skus.styleid=styles.id
        GROUP BY styles.id
        HAVING productId=$1`
        , [productID])
      callback(null, stylesResult.rows);
    } catch (error) {
      callback(error, null);
    }
  }
};

/*
        (SELECT jsonb_agg(jsonb_build_object('url', photos.url, 'thumbnail_url', photos.thumbnail_url))
          FROM photos WHERE photos.styleid=$1) AS photos,
          (SELECT json_object_agg(skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size))
          FROM skus WHERE skus.styleid=$1) AS skus
        FROM styles WHERE styles.productId=$1 ORDER BY styles.id
*/