const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maintenanceBillFinance = new Schema({
  gst: { type: Number, required: true, default: 0 },
  ratePerSquareMeter: { type: Number, required: true, default: 0 },
  lateBillAfter: { type: Number, required: true, default: 0 },
  billRaisingDate: { type: Number, required: true, default: 1 },
  billRaisingMonth: { type: Number, required: true, default: 1}
});

const MaintenanceBillFinance = mongoose.model(
  "MaintenanceBillFinance",
  maintenanceBillFinance
);

module.exports = MaintenanceBillFinance;
