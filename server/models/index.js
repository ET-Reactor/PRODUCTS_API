const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async (productID, callback) => {
    try {
      const res = await pool.query("SELECT * FROM related WHERE current_product_id=?", [productID]);
      console.log(res.rows);
    } catch (error) {
      console.log('getRelated', error);
    }
  },
  getProduct: async (productID, callback) => {
    console.log('getting product, id:', productID);
    try {
      const productResult = await pool.query("SELECT * FROM product WHERE id=$1", [productID]);
      const featuresResult = await pool.query("SELECT feature, value FROM features WHERE product_id=$1", [productID]);
      productResult.rows[0].features = featuresResult.rows;
      callback(null, productResult.rows);
    } catch (error) {
      callback(error, null);
    }
  },
  getProducts: () => {

  },
  getStyles: async (productID, callback) => {
    try {
      const res = await pool.query("SELECT * FROM styles WHERE productId=?", [productID]);
      console.log(res.rows);
    } catch (error) {
      console.log('getStyles', error);
    }
  }
};