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
  getProducts: async (resultsCount, callback) => {
    try {
      if (resultsCount === undefined) {
        const productsResult = await pool.query("SELECT * FROM product LIMIT 5");
        callback(null, productsResult.rows);
      } else {
        const productsResult = await pool.query("SELECT * FROM product LIMIT $1", [resultsCount]);
        callback(null, productsResult.rows);
      }
    } catch (error) {
      callback(error, null);
    }
  },
  getStyles: async (productID, callback) => {
    try {
      let skusArr = [];
      const stylesResult = await pool.query("SELECT * FROM styles WHERE productId=$1", [productID]);
      stylesResult.rows.forEach(row => {
        let styleID = row.id;
        const photosResult = pool.query("SELECT url, thumbnail_url FROM photos WHERE styleID=$1", [styleID])
          .then((response) => {
            row.photos = (response.rows);
            console.log('should have photos added', row);
          })
          .catch((err) => console.log('Error selecting photos'));
      });
      callback(null, stylesResult.rows);
    } catch (error) {
      callback(error, null);
    }
  }
};

// const stylesResult = await pool.query("SELECT styles.*, photos.url, photos.thumbnail_url FROM styles INNER JOIN photos ON photos.styleID=styles.id WHERE productId=$1", [productID]);