const maintenanceBillFinance = require("../models/maintenanceBillFinance");

exports.getMtcBillFinance = async (req, res) => {
  try {
    const maintenanceBillFinanceData = await maintenanceBillFinance.findOne();
    res.status(200).json(maintenanceBillFinanceData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}