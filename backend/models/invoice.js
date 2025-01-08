const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemsName: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerItem: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    items: [itemSchema],
    total: { type: Number},
});

// Calculate total price automatically before saving
invoiceSchema.pre('save', function (next) {
    this.total = this.items.reduce((acc, item) => acc + (item.quantity * item.pricePerItem), 0);
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
