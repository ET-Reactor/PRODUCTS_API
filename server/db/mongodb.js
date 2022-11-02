require('dotenv').config();
const mongoose, { Schema } = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.PGDATABASE}`);

const featuresSchema = new Schema({ feature: String, value: String });
const relatedSchema = new Schema({ related_product_id: Number });
const productSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [featuresSchema],
  related_products: [relatedSchema]
});
const skusSchema = new Schema({ size: String, quantity: Number });
const photosSchema = new Schema({ url: String, thumbnail_url: String });
const styleSchema = new Schema({
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