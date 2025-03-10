const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  ResponseCode: {
    type: String,
    required: true,
  },
  UniqueRefNo: {
    type: String,
    required: true,
  },
  ServiceTaxAmount: {
    type: String,
    required: true,
  },
  ProcessingFeeAmount: {
    type: String,
    required: true,
  },
  TotalAmount: {
    type: String,
    required: true,
  },
  TransactionAmount: {
    type: String,
    required: true,
  },
  TransactionDate: {
    type: String,
    required: true,
  },
  PaymentMode: {
    type: String,
    required: true,
  },
  SubMerchantID: {
    type: String,
    required: true,
  },
  ReferenceNo: {
    type: String,
    required: true,
  },
  Id: {
    type: String,
    required: true,
  },
});

const payementModel = mongoose.model("PaymentModel", paymentSchema);

module.exports = payementModel;
