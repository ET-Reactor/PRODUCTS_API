require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.PGDATABASE}`);

const featuresSchema = new mongoose.Schema({ feature: String, value: String });
const relatedSchema = new mongoose.Schema({ related_product_id: Number });
const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [featuresSchema],
  related_products: [relatedSchema]
});
const skusSchema = new mongoose.Schema({ size: String, quantity: Number });
const photosSchema = new mongoose.Schema({ url: String, thumbnail_url: String });
const styleSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  productId: Number,
  name: String,
  original_price: String,
  sale_price: String,
  default_style: Boolean,
  skus: [skusSchema],
  photos: [photosSchema]
});

const Product = mongoose.model('Product', productSchema);
const Style = mongoose.model('Style', styleSchema);

module.exports.Product = Product;
module.exports.Style = Style;