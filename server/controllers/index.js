const models = require('../models');

const products = {
  getRelated: (req, res) => {
    // models.getRelated()
    res.status(200).send("get related products")
  },
  getOne: (req, res) => {
    res.status(200).send('get one product')
  },
  getAll: (req, res) => {
    res.status(200).send('get all products')
  },
  getStyles: (req, res) => {
    res.status(200).send('get product styles')
  }
}


module.exports = products;