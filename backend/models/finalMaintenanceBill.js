const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const finalMaintenanceBill = new Schema({
  date: {
    type: Date,
    required: true,
  },
  consumerName: {
    type: String,
    required: true,
  },
  premises: {
    type: String,
    required: true,
    index: true,
  },
  rsPerSquareM: {
    type: Number,
    required: true,
  },
  arrears: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  amountPayOnDueDate: {
    type: String,
    required: true,
  },
  latePaymentSurcharge: {
    type: String,
    required: true,
  },
  amountPayAfterDueDate: {
    type: String,
    required: true,
  },
  currentTotal: {
    type: String,
    required: true,
  },
  isDue: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("finalMaintenanceBill", finalMaintenanceBill);
