const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Main_data_status: { type: String, default: '' },
  Extra_data_status: { type: String, default: '' },
  importer: { type: String, default: '' },
  monitor: { type: String, default: '' },
  cluster: { type: String, default: '' },
  child_cluster: { type: String, default: '' },
  product_name: { type: String, default: '' },
  brand: { type: String, default: '' },
  picture_old: { type: String, default: '' },
  picture_new: { type: String, default: '' },
  picture_main_info: { type: String, default: '' },
  picture_extra_info: { type: String, default: '' },
  product_description: { type: String, default: '' },
  barcode: { type: String, required: true, unique: true },
  state_of_matter: { type: String, default: '0' },
  per: { type: String, default: '0' },
  calorie: { type: String, default: '0' },
  sugar: { type: String, default: '0' },
  fat: { type: String, default: '0' },
  salt: { type: String, default: '0' },
  trans_fatty_acids: { type: String, default: '0.14' },
  per_ext: { type: String, default: '' },
  calorie_ext: { type: String, default: '' },
  cal_fat: { type: String, default: '' },
  total_fat: { type: String, default: '' },
  saturated_fat: { type: String, default: '' },
  unsaturated_fat: { type: String, default: '' },
  trans_fat: { type: String, default: '' },
  protein: { type: String, default: '' },
  sugar_ext: { type: String, default: '' },
  carbohydrate: { type: String, default: '' },
  fiber: { type: String, default: '' },
  salt_ext: { type: String, default: '' },
  sodium: { type: String, default: '' },
  cholesterol: { type: String, default: '' },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema, 'Salemina_new');

module.exports = Product;
