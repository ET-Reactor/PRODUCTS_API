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
    if (req.query.count) {
      let productsCount = req.query.count;
    }
    if (req.query.page) {
      let productsPage = req.query.page;
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
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(styles)
    })
  }
}


module.exports.products = products;