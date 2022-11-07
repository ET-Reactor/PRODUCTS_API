const models = require('../models');

const products = {
  getRelated: (req, res) => {
    let productID = req.params.id;
    models.getRelated(productID, (err, related) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(related)
    })
  },
  getOne: (req, res) => {
    let productID = req.params.id;
    models.getProduct(productID, (err, product) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(product)
    })
  },
  getAll: (req, res) => {
    let productsCount;
    let productsPage;
    if (req.query.count) {
      productsCount = req.query.count;
    } else {
      productsCount = 5;
    }
    if (req.query.page) {
      productsPage = req.query.page;
    } else {
      productsPage = 1;
    }
    models.getProducts(productsPage, productsCount, (err, products) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(products)
    })
  },
  getStyles: (req, res) => {
    let productID = req.params.id;
    models.getStyles(productID, (err, styles) => {
      // console.log(err, styles);
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(styles)
    })
  }
}


module.exports.products = products;