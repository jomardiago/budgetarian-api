const mongoose = require('mongoose');

const groceryItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('GroceryItem', groceryItemSchema, 'groceryItems');
