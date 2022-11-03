const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async () => {
    try {
      const res = await pool.query("SELECT * FROM related");
      console.log(res.rows);
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: () => {

  },
  getProducts: () => {

  },
  getStyles: () => {

  }
};