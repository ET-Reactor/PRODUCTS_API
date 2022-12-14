const models = require('../models');

const products = {
  getRelated: (req, res) => {
    models.getRelated(req.params.id, (err, related) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(related)
    })
  },
  getOne: (req, res) => {
    models.getProduct(req.params.id, (err, product) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(product)
    })
  },
  getAll: (req, res) => {
    models.getProducts(req.query.page ? req.query.page : 1, req.query.count ? req.query.count : 5, (err, products) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(products)
    })
  },
  getStyles: (req, res) => {
    models.getStyles(req.params.id, (err, styles) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(styles)
    })
  }
}


module.exports.products = products;