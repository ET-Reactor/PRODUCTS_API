const { pool } = require('../db/db.js');
// const db = require('../db/mongodb.js');

module.exports = {
  getRelated: async (productID, callback) => {
    try {
      // const relatedResult = await pool.query("SELECT related_product_id FROM related WHERE current_product_id=$1", [productID]);
      // const newRelated = [];
      // relatedResult.rows.forEach(row => newRelated.push(row.related_product_id));
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
      // const productResult = await pool.query("SELECT * FROM product WHERE id=$1", [productID]);
      // const featuresResult = await pool.query("SELECT feature, value FROM features WHERE product_id=$1", [productID]);
      // productResult.rows[0].features = featuresResult.rows;
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
  getProducts: async (resultsCount, callback) => {
    try {
      const productsResult = await pool.query(`
        SELECT
          *
        FROM product
        LIMIT 5
      `);
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
          styles.sale_price,
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

// const stylesResult = await pool.query("SELECT styles.*, photos.url, photos.thumbnail_url FROM styles INNER JOIN photos ON photos.styleID=styles.id WHERE productId=$1", [productID]);

      // .then(async (res) => {
      //   console.log('first time rows', res.rows)
      //   let styleID = res.rows.id;
      //   res.rows.forEach(async row => {
      //     await pool.query("SELECT url, thumbnail_url FROM photos WHERE styleID=$1", [styleID])
      //       .then((response) => {
      //         row.photos = (response.rows);
      //       })
      //       .catch((err) => console.log('Error selecting photos'));
      //     await pool.query("SELECT id, size, quantity FROM skus WHERE styleID=$1", [styleID])
      //       .then((response) => {
      //         // console.log('skus result', response.rows);
      //         row.skus = {};
      //         for (key in response.rows) {
      //           row.skus[response.rows[key].id] = {};
      //           row.skus[response.rows[key].id].size = response.rows[key].size;
      //           row.skus[response.rows[key].id].quantity = response.rows[key].quantity;
      //         }
      //       })
      //       .catch((err) => console.log('Error selecting skus'));
      //   })
      //   console.log('first then', res.rows);
      //   return res.rows;
      // })
      // .then((res) => console.log(res))
      // .catch((err) => console.log(err))