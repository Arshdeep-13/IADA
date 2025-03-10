const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const maintenanceSchema = new Schema({
    industry_id: {
        type: Schema.Types.ObjectId,
        ref: 'Industry',
        required: true
    },
    premises: {
        type: String,
        required: true,
        index: true
    },
    consumer_name: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    isDue: {
        type: Boolean,
        default: true,
    },
    outstandingAmount: {
        type: Number,
        required: true,
        default: 0
    },
    industry_area: {
        type: Number,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    bill_payment_date: {
        type: Date
    },
    latePaymentSurcharge: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true
    }
});

const MaintenanceBills = mongoose.model('MaintenanceBills', maintenanceSchema);

module.exports = MaintenanceBills;