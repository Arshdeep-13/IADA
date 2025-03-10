const express = require("express");
const router = express.Router();
const waterBillFinance = require("../models/waterBill");
const {
  WaterBillZone123,
  WaterBillZone456,
  WaterBillZone789,
  WaterBillZone111,
  WaterBillZone222,
  WaterBillZone333,
  WaterBillZone777,
} = require("../models/waterBills");
const waterBillAll = require("../models/waterBills");
const Industry = require("../models/industry");
const finalWaterBill = require("../models/finalWaterBill");
const { addAlert } = require("../services/alertService");
const { billUpdateAlert } = require("../utils/constants");
const authMiddleware = require("../middleware/authMiddleware");
const zonalAdminMiddleware = require("../middleware/zonalAdminMiddleware");
const paymentReceipt = require("../models/paymentReceipt");
const industryBillAssociation = require("../models/industryBillAssociation");
const industryPaymentLinksModel = require("../models/industryPaymentLinks");
const payementModel = require("../models/paymentModel");
const {
  getMtcBillFinance,
} = require("../controllers/maintenanceBillController");

const getModelByZoneId = (zone_id) => {
  switch (zone_id) {
    case 123:
      return WaterBillZone123;
    case 456:
      return WaterBillZone456;
    case 789:
      return WaterBillZone789;
    case 111:
      return WaterBillZone111;
    case 222:
      return WaterBillZone222;
    case 333:
      return WaterBillZone333;
    case 777:
      return WaterBillZone777;
    default:
      return null;
  }
};
//this sets the isDue to false after bill payment
const waterbillpaid = async (industry_id) => {
  try {
    const industry = await Industry.findById(industry_id);
    if (!industry) {
      throw new Error("Industry not found");
    }

    const model = getModelByZoneId(parseInt(industry.zone_id, 10));
    if (!model) {
      throw new Error("No model found for the provided zone_id");
    }

    const billAssociation = await industryBillAssociation.findOne({
      plot_number: industry.plot_number,
    });
    if (!billAssociation) {
      throw new Error(
        "Bill association not found for the provided plot_number"
      );
    }

    const bills = await model.find({
      consumerNo: billAssociation.consumerNo,
      isDue: true,
    });
    if (bills.length === 0) {
      throw new Error("No due bills found for the provided consumer number");
    }

    const updateResult = await model.updateMany(
      { consumerNo: billAssociation.consumerNo, isDue: true },
      { $set: { isDue: false } }
    );
    await finalWaterBill.findOneAndDelete({
      consumerNo: billAssociation.consumerNo,
    });

    console.log(
      `Successfully updated ${updateResult.modifiedCount} bills to set isDue as false.`
    );

    return updateResult;
  } catch (error) {
    console.error("Error while updating bills:", error.message);
  }
};

// POST endpoint to update water bill settings
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { parsedFormData } = req.body;
    const updatedWaterBill = {
      gst: parseInt(parsedFormData.gst, 10),
      permaConnectionRatePerKL: parseInt(
        parsedFormData.permaConnectionRatePerKL,
        10
      ),
      tempConnectionRatePerKL: parseInt(
        parsedFormData.tempConnectionRatePerKL,
        10
      ),
      newConnectionFee: parseInt(parsedFormData.newConnectionFee, 10),
      lateBillAfter: parseInt(parsedFormData.lateBillAfter, 10),
      latePaymentFine: parseInt(parsedFormData.latePaymentFine, 10),
      billRaisingDate: parsedFormData.billRaisingDate,
      duration: parseInt(parsedFormData.duration, 10),
      sewerageFee: parseInt(parsedFormData.sewerageFee, 10),
      minimumPayment: parseInt(parsedFormData.minimumPayment, 10),
    };
    const Finance = await waterBillFinance.findOneAndReplace(
      { _id: "665c3b7f2bb50f4a4aeda511" },
      updatedWaterBill,
      { new: true, upsert: true }
    );
    res.status(200).send(Finance);
  } catch (error) {
    console.error("Error updating water bill settings:", error);
    res.status(500).send("Server error");
  }
});

router.post("/fetchallbills", async (req, res) => {
  try {
    const { email, zone_id } = req.body;

    const industry = await Industry.findOne({ email: email });
    if (!industry) {
      return res.status(404).send("Industry not found");
    }

    const transaction = await industryPaymentLinksModel.findOne({
      industry_id: industry._id,
    });

    if (!transaction) {
      return res.status(404).send("Payment history not found");
    }
    const paymentHistory = transaction.payment_history_array;
    const allPayments = await payementModel.find({});
    const filteredPayments = allPayments.filter((payment) =>
      paymentHistory.includes(payment.Id)
    );

    if (filteredPayments.length === 0) {
      return res
        .status(404)
        .send("No payments found for the provided payment history");
    }

    const responseData = filteredPayments.map((payment) => ({
      ResponseCode: payment.ResponseCode,
      UniqueRefNo: payment.UniqueRefNo,
      ServiceTaxAmount: payment.ServiceTaxAmount,
      ProcessingFeeAmount: payment.ProcessingFeeAmount,
      TotalAmount: payment.TotalAmount,
      TransactionAmount: payment.TransactionAmount,
      TransactionDate: payment.TransactionDate,
      PaymentMode: payment.PaymentMode,
      SubMerchantID: payment.SubMerchantID,
      ReferenceNo: payment.ReferenceNo,
      Id: payment.Id,
    }));

    // Send the response data to the frontend
    res.status(200).send({ payments: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

router.get(
  "/getfullzonepayment/:zone_id",
  zonalAdminMiddleware,
  async (req, res) => {
    try {
      const { zone_id } = req.params;
      const industryIds = await Industry.find({ zone_id }).distinct("_id");

      if (!industryIds.length) {
        return res
          .status(404)
          .json({ message: "No industries found for this zone" });
      }

      const transactions = await industryPaymentLinksModel.find({
        industry_id: { $in: industryIds },
      });

      if (!transactions.length) {
        return res
          .status(404)
          .json({
            message: "No transactions found for the provided industries",
          });
      }

      const paymentHistoryMap = {};
      transactions.forEach((transaction) => {
        transaction.payment_history_array.forEach((paymentId) => {
          paymentHistoryMap[paymentId] = transaction.industry_id;
        });
      });

      const paymentHistoryIds = transactions.flatMap(
        (transaction) => transaction.payment_history_array
      );
      const payments = await payementModel.find({
        Id: { $in: paymentHistoryIds },
      });

      if (!payments.length) {
        return res
          .status(404)
          .json({ message: "No payments found for the provided industries" });
      }

      const industryPayments = payments.map((payment) => ({
        industry_id: paymentHistoryMap[payment.Id],
        ResponseCode: payment.ResponseCode,
        UniqueRefNo: payment.UniqueRefNo,
        ServiceTaxAmount: payment.ServiceTaxAmount,
        ProcessingFeeAmount: payment.ProcessingFeeAmount,
        TotalAmount: payment.TotalAmount,
        TransactionAmount: payment.TransactionAmount,
        TransactionDate: payment.TransactionDate,
        PaymentMode: payment.PaymentMode,
        SubMerchantID: payment.SubMerchantID,
        ReferenceNo: payment.ReferenceNo,
        Id: payment.Id,
      }));

      res.status(200).json({ industryPayments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post("/fetchbill", async (req, res) => {
  //for one bill
  try {
    const { email, zone_id } = req.body;
    const plot = (await Industry.findOne({ email: email })).plot_number;
    // Get the appropriate model based on the zone_id
    //this gets the fnial water bill
    const data = await finalWaterBill.findOne({ premises: plot });
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

router.post("/getone", async (req, res) => {
  try {
    const { premises } = req.body;
    const bill = await finalWaterBill
      .findOne({ premises })
      .select("-_id -__v -latePaymentSurcharge");
    if (!bill) {
      return res.status(404).send("Bill not found");
    }

    res.json(bill);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/updateone", authMiddleware, async (req, res) => {
  try {
    const { premises, ...updatedData } = req.body;

    const bill = await finalWaterBill.findOneAndUpdate(
      { premises: premises },
      updatedData,
      { new: true }
    );
    const industry = await Industry.findOne({
      plot_number: premises,
    });
    if (!bill) {
      return res.status(404).send("Bill not found");
    }
    await addAlert(industry._id, {
      title: billUpdateAlert?.title,
      content: billUpdateAlert.content,
      date: new Date().toISOString(),
      zone_id: industry.zone_id,
      alert_type: "industry",
    });

    res.json(bill);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/getFinances", async (req, res) => {
  try {
    return res.status(200).json(await waterBillFinance.findOne());
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/fetchbillsbyzone/:zone_id", async (req, res) => {
  //for all bills of the zone
  try {
    const { zone_id } = req.params;
    const WaterBillModel = getModelByZoneId(parseInt(zone_id, 10));

    if (!WaterBillModel) {
      return res.status(500).send("Invalid zone_id");
    }

    const bills = await WaterBillModel.find({});
    const premisesList = bills.map((bill) => bill.premises);

    const industries = await Industry.find({
      plot_number: { $in: premisesList },
    });

    const mergedData = bills.map((bill) => {
      const industry = industries.find(
        (ind) => ind.plot_number === bill.premises
      );
      return {
        ...bill.toObject(),
        industryInfo: industry ? industry.toObject() : null,
      };
    });

    res.status(200).send(mergedData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

router.get("/allzone", async (req, res) => {
  try {
    const data123 = await WaterBillZone123.find({});
    const data456 = await WaterBillZone456.find({});
    const data789 = await WaterBillZone789.find({});
    const data111 = await WaterBillZone111.find({});
    const data222 = await WaterBillZone222.find({});
    const data333 = await WaterBillZone333.find({});

    const data123WithZone = data123.map((item) => ({
      ...item._doc,
      zone: "123",
    }));
    const data456WithZone = data456.map((item) => ({
      ...item._doc,
      zone: "456",
    }));
    const data789WithZone = data789.map((item) => ({
      ...item._doc,
      zone: "789",
    }));
    const data111WithZone = data111.map((item) => ({
      ...item._doc,
      zone: "111",
    }));
    const data222WithZone = data222.map((item) => ({
      ...item._doc,
      zone: "222",
    }));
    const data333WithZone = data333.map((item) => ({
      ...item._doc,
      zone: "333",
    }));

    const allZoneData = [
      ...data123WithZone,
      ...data456WithZone,
      ...data789WithZone,
      ...data111WithZone,
      ...data222WithZone,
      ...data333WithZone,
    ];

    res.status(201).send({
      message: "data fetch succesfully",
      success: true,
      data: allZoneData,
    });
  } catch (error) {
    res.status(201).send({
      message: "Something went wrong",
      success: false,
    });
  }
});

router.get("/billbyZone", async (req, res) => {
  try {
    const { zoneId } = req.query;
    const WaterBillModel = waterBillAll.getModelByZoneId(zoneId);
    const bills = await WaterBillModel.find();
    res.status(201).send({
      message: "data fetch succesfully",
      success: true,
      data: bills,
    });
  } catch (error) {
    res.status(201).send({
      message: "Something went wrong",
      success: false,
    });
  }
});

router.get("/getmtcfinances", getMtcBillFinance);

module.exports = { router, waterbillpaid };
