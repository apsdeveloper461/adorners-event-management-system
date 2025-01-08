const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['dues', 'pay'],
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: function() { return this.type === 'credit'; }
    },
    companyName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Ledger', LedgerSchema);
