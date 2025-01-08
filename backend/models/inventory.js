const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    category_id: { type: String, required: true,unique: true },
    name: { type: String, required: true },
    specification: { type: String, required: true },
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Inventory', inventorySchema);
