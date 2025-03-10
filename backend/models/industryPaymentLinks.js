const mongoose = require("mongoose");

const industryPaymentLinksSchema = new mongoose.Schema({
  industry_id: {
    type: String,
    required: true,
  },
  payment_history_array: {
    type: Array,
    default: [],
  },
});

const industryPaymentLinksModel = new mongoose.model(
  "industryPaymentLinksModel",
  industryPaymentLinksSchema
);

module.exports = industryPaymentLinksModel;
