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
      const stylesResult = await pool.query("SELECT styles.*, jsonb_agg(to_jsonb(photos) - 'id' - 'styleid') AS photos FROM styles LEFT JOIN photos ON photos.styleid=styles.id WHERE productId=$1 GROUP BY styles.id", [productID])
      console.log(stylesResult.rows);
      // stylesResult.rows.forEach((row, i) => {
      //   delete row.productid;
      //   let styleID = row.id;
      //   pool.query("SELECT url, thumbnail_url FROM photos WHERE styleID=$1", [styleID])
      //     .then(photos => {
      //       row.photos = photos.rows;

      //       pool.query("SELECT id, size, quantity FROM skus WHERE styleID=$1", [styleID])
      //         .then(skus => {
      //           row.skus = {};
      //           for (key in skus.rows) {
      //             row.skus[skus.rows[key].id] = {};
      //             row.skus[skus.rows[key].id].size = skus.rows[key].size;
      //             row.skus[skus.rows[key].id].quantity = skus.rows[key].quantity;
      //           }
      //           console.log(stylesResult.rows);
      //           // if (i === stylesResult.rows.length - 1) {
      //           //   callback(null, stylesResult.rows);
      //           // }
      //         })
      //     })
      // })

      // stylesResult.rows.forEach(async row => {
      //   let styleID = row.id;
      //   const photosResult = await pool.query("SELECT url, thumbnail_url FROM photos WHERE styleID=$1", [styleID])
      //     .then(async (response) => {
      //       row.photos = (response.rows);
      //     })
      //     // .then(() => console.log('pls', styles))
      //     .catch((err) => console.log('Error selecting photos'));
      //   const skusResult = await pool.query("SELECT id, size, quantity FROM skus WHERE styleID=$1", [styleID])
      //     .then((response) => {
      //       // console.log('skus result', response.rows);
      //       row.skus = {};
      //       for (key in response.rows) {
      //         row.skus[response.rows[key].id] = {};
      //         row.skus[response.rows[key].id].size = response.rows[key].size;
      //         row.skus[response.rows[key].id].quantity = response.rows[key].quantity;
      //       }
      //       // return row;
      //       // console.log(row)
      //       console.log('should have skus added', row);
      //     })
      //     .catch((err) => console.log('Error selecting skus'));
      // });

      // const addPhotoSkus = async () => {
      //   for (let i = 0; i < stylesResult.rows.length; i++) {
      //     let row = stylesResult.rows[i]
      //     let styleID = row.id;
      //     const photosResult = await pool.query("SELECT url, thumbnail_url FROM photos WHERE styleID=$1", [styleID])
      //       .then(async (response) => {
      //         row.photos = (response.rows);
      //       })
      //       // .then(() => console.log('pls', styles))
      //       .catch((err) => console.log('Error selecting photos'));
      //     const skusResult = await pool.query("SELECT id, size, quantity FROM skus WHERE styleID=$1", [styleID])
      //       .then((response) => {
      //         // console.log('skus result', response.rows);
      //         row.skus = {};
      //         for (key in response.rows) {
      //           row.skus[response.rows[key].id] = {};
      //           row.skus[response.rows[key].id].size = response.rows[key].size;
      //           row.skus[response.rows[key].id].quantity = response.rows[key].quantity;
      //         }
      //         // return row;
      //         // console.log(row)
      //         // console.log('should have skus added', row);
      //       })
      //       .catch((err) => console.log('Error selecting skus'));
      //   }
      //   callback(null, stylesResult.rows);
      // }
      // addPhotoSkus();

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