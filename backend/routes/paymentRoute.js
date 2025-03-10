const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const { encryptAES } = require("../config/paymentConfig");
const payementModel = require("../models/paymentModel");
const industryPaymentLinksModel = require("../models/industryPaymentLinks");
const { waterbillpaid } = require("./financeRoute");

const aesKey = "3865891963401700"; // Replace with your assigned AES Key
const plainUrl = "https://eazypay.icicibank.com/EazyPG";
const returnUrl = "https://backend.iadabaddi.com/waterbill-payment/processing";
const paymentReceipt = require("../models/paymentReceipt");

router.post("/", (req, res) => {
  const { amount } = req.body;
  const referenceNo = uuidv4().toString(); // Replace with a valid unique reference number
  const subMerchantId = "1234"; // Replace with your assigned sub-merchant ID
  const transactionAmount = amount || "1"; // Ensure this matches the Eazypay format (no decimals if unnecessary)
  const payMode = "9"; // Numeric pay mode, e.g., 9 for all
  const mandatoryFields = `${referenceNo}|${subMerchantId}|${transactionAmount}`; // ReferenceNo|SubMerchantID|Amount
  const optionalFields = ``;

  // If encryption is required
  const encryptedMandatoryFields = encryptAES(aesKey, mandatoryFields);
  const encryptedOptionalFields = encryptAES(aesKey, optionalFields);
  const encryptedReturnUrl = encryptAES(aesKey, returnUrl);
  const encryptPaymentMode = encryptAES(aesKey, payMode);
  const encryptReferenceNo = encryptAES(aesKey, referenceNo);
  const encryptSubMerchantId = encryptAES(aesKey, subMerchantId);
  const encryptTransactionAmount = encryptAES(aesKey, transactionAmount);

  // Construct the URL
  const encryptedUrl = `${plainUrl}?merchantid=386342&mandatory fields=${encodeURIComponent(
    encryptedMandatoryFields
  )}&optional fields=${encodeURIComponent(
    encryptedOptionalFields
  )}&returnurl=${encodeURIComponent(
    encryptedReturnUrl
  )}&Reference No=${encodeURIComponent(
    encryptReferenceNo
  )}&submerchantid=${encodeURIComponent(
    encryptSubMerchantId
  )}&transaction amount=${encodeURIComponent(
    encryptTransactionAmount
  )}&paymode=${encodeURIComponent(encryptPaymentMode)}`;

  console.log({
    referenceNo,
    subMerchantId,
    transactionAmount,
    payMode,
    mandatoryFields,
    optionalFields,
    encryptedMandatoryFields,
    encryptedOptionalFields,
    encryptPaymentMode,
  });

  res.json({ encryptedUrl });
});

router.post("/processing", async (req, res) => {
  const {
    "Response Code": ResponseCode,
    "Unique Ref Number": UninqueRefNo,
    "Service Tax Amount": ServiceTaxAmount,
    "Processing Fee Amount": ProcessingFeeAmount,
    "Total Amount": TotalAmount,
    "Transaction Amount": transactionAmount,
    "Transaction Date": TransactionDate,
    "Payment Mode": PaymentMode,
    SubMerchantId: submerchantid,
    ReferenceNo,
    ID,
    industryId, // Pass industryId from frontend
  } = req.body;

  try {
    if (ResponseCode === "E000") {
      // Save transaction to DB
      const payment = new payementModel({
        ResponseCode,
        UniqueRefNo: UninqueRefNo,
        ServiceTaxAmount,
        ProcessingFeeAmount,
        TotalAmount,
        TransactionAmount: transactionAmount,
        TransactionDate,
        PaymentMode,
        SubMerchantID: submerchantid,
        ReferenceNo,
        Id: ID,
      });
      const savedPayment = await payment.save();

      // Call save-mapping function directly
      try {
        const industryFound = await industryPaymentLinksModel.find({
          industry_id: industryId,
        });

        if (industryFound.length > 0) {
          await industryFound[0].payment_history_array.push(savedPayment._id);
          await industryFound[0].save();
        } else {
          const newIndustry = await industryPaymentLinksModel({
            industry_id: industryId,
            payment_history_array: [savedPayment._id],
          });
          await newIndustry.save();
        }

        // Call waterbillpaid function to update isDue
        await waterbillpaid(industryId);
      } catch (error) {
        console.error("Error saving payment mapping:", error);
        // Continue with redirect even if mapping fails
      }

      return res.redirect(
        `https://iadabaddi.com/payment-success?ResponseCode=${ResponseCode}&UninqueRefNo=${UninqueRefNo}&ServiceTaxAmount=${ServiceTaxAmount}&ProcessingFeeAmount=${ProcessingFeeAmount}&TotalAmount=${TotalAmount}&TransactionAmount=${transactionAmount}&TransactionDate=${TransactionDate}&PaymentMode=${PaymentMode}&submerchantid=${submerchantid}&ReferenceNo=${ReferenceNo}&ID=${ID}`
      );
    } else {
      return res.redirect(
        `https://iadabaddi.com/payment-failure?ResponseCode=${ResponseCode}&UninqueRefNo=${UninqueRefNo}&ServiceTaxAmount=${ServiceTaxAmount}&ProcessingFeeAmount=${ProcessingFeeAmount}&TotalAmount=${TotalAmount}&TransactionAmount=${transactionAmount}&TransactionDate=${TransactionDate}&PaymentMode=${PaymentMode}&submerchantid=${submerchantid}&ReferenceNo=${ReferenceNo}&ID=${ID}`
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.redirect(
      `https://iadabaddi.com/payment-failure?error=processing_failed`
    );
  }
});

module.exports = router;
