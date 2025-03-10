const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  referenceNo: { type: String, required: true, unique: true },
  transactionAmount: { type: String, required: true },
  subMerchantId: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
