const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async (productID, callback) => {
    try {
      const relatedResult = await pool.query("SELECT related_product_id FROM related WHERE current_product_id=$1", [productID]);
      const newRelated = [];
      relatedResult.rows.forEach(row => newRelated.push(row.related_product_id));
      callback(null, newRelated);
    } catch (error) {
      callback(error, null);
    }
  },
  getProduct: async (productID, callback) => {
    try {
      const productResult = await pool.query("SELECT * FROM product WHERE id=$1", [productID]);
      const featuresResult = await pool.query("SELECT feature, value FROM features WHERE product_id=$1", [productID]);
      productResult.rows[0].features = featuresResult.rows;
      callback(null, productResult.rows);
    } catch (error) {
      callback(error, null);
    }
  },
  getProducts: async (callback) => {
    try {
      const productsResult = await pool.query("SELECT * FROM product LIMIT 5");
      callback(null, productsResult.rows);
    } catch (error) {
      callback(error, null);
    }
  },
  getStyles: async (productID, callback) => {
    try {
      const res = await pool.query("SELECT * FROM styles WHERE productId=$1", [productID]);
      console.log(res.rows);
    } catch (error) {
      console.log('getStyles', error);
    }
  }
};