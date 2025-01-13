const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const eventSchema = new mongoose.Schema({
    date: { type: String, required: true },
    // day: { type: String, required: true },
    phone_no:{type:String, required:true},
    eventPlace: { type: String, required: true },
    ballons: { type: String, required: true },
    company: { type: String, required: true },
    employees: { type: String, required: true },
    details: { type: String, required: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
});

eventSchema.plugin(AutoIncrement, { inc_field: 'index' });

module.exports = mongoose.model('Event', eventSchema);
