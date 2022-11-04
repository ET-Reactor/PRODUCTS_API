const models = require('../models');

const products = {
  getRelated: (req, res) => {
    let productID = req.query.id;
    models.getRelated(productID, (err, related) => {
      if (err) {
        res.status(404).end();
      }
      res.status(200).json(related)
    })
  },
  getOne: (req, res) => {
    let productID = req.query.id;
    models.getProduct(productID, (err, product) => {
      if (err) {
        res.status(404).end();
      }
      res.status(200).json(product)
    })
  },
  getAll: (req, res) => {
    res.status(200).send('get all products')
  },
  getStyles: (req, res) => {
    let productID = req.query.id;
    models.getStyles(productID, (err, styles) => {
      if (err) {
        res.status(404).end();
      }
      res.status(200).json(styles)
    })
  }
}


module.exports.products = products;