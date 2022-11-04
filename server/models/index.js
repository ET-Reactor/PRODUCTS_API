const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async (productID, callback) => {
    try {
      const res = await pool.query("SELECT * FROM related WHERE current_product_id=?", [productID]);
      console.log(res.rows);
    } catch (error) {
      console.log('getRelated error', error);
    }
  },
  getProduct: async (productID, callback) => {
    try {
      const res = await pool.query("SELECT * FROM product WHERE id=?", [productID]);
      console.log(res.rows);
    } catch (error) {
      console.log('getProduct error', error);
    }
  },
  getProducts: () => {

  },
  getStyles: async (productID, callback) => {
    try {
      const res = await pool.query("SELECT * FROM styles WHERE productId=?", [productID]);
      console.log(res.rows);
    } catch (error) {
      console.log('getStyles error', error);
    }
  }
};