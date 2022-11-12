const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async (productID, callback) => {
    const client = await pool.connect();
    try {
      const relatedResult = await client.query(`
        SELECT
          jsonb_agg(related_product_id) AS rps
        FROM related
        WHERE current_product_id=$1
      `, [productID]);
      callback(null, relatedResult.rows[0].rps);
    } catch (error) {
      callback(error, null);
    } finally {
      client.release();
    }
  },

  getProduct: async (productID, callback) => {
    const client = await pool.connect();
    try {
      const productResult = await client.query(`
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
    } finally {
      client.release();
    }
  },

  getProducts: async (productsPage, productsCount, callback) => {
    const client = await pool.connect();
    try {
      const productsResult = await client.query(`
        SELECT
          *
        FROM product
        ORDER BY product.id
        LIMIT $1 OFFSET (($2 - 1) * $1)
      `, [productsCount, productsPage]);
      callback(null, productsResult.rows);
    } catch (error) {
      callback(error, null);
    } finally {
      client.release();
    }
  },

  getStyles: async (productID, callback) => {
    const client = await pool.connect();
    try {
      const stylesResult = await client.query(
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
      callback(null, {
        product_id: productID,
        results: stylesResult.rows
      });
    } catch (error) {
      callback(error, null);
    } finally {
      client.release();
    }
  }
};