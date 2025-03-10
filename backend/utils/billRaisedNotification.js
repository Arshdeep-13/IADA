const finalWaterBill = require("../models/finalWaterBill");
const Industry = require("../models/industry");

const getIndustriesContact = async () => {
  try {
    const bills = await finalWaterBill.find({});
    const premisesSet = new Set(bills.map(bill => bill.premises));

    //set final bills to due
    await finalWaterBill.updateMany({}, { $set: { isDue: true } });

    const industries = await Industry.find({ plot_number: { $in: Array.from(premisesSet) } });
    const phoneNumbers = industries.map(industry => industry.phone_number);

    return phoneNumbers;
  } catch (error) {
    console.error("Error fetching industries contact:", error);
    return [];
  }
};

const createPayloads = (phoneNumbers) => {
  const payloads = [];
  const batchSize = 10;

  for (let i = 0; i < phoneNumbers.length; i += batchSize) {
    const batch = phoneNumbers.slice(i, i + batchSize);

    const payload = {
      keyword: "digimate",
      timestamp: new Date().toISOString().replace(/[-T:.Z]/g, ""),
      dataSet: batch.map((number) => ({
        message: "Industrial Area Development Agency: Dear Customer, your Water Bill is now available. Kindly pay at iadabaddi.com",
        oa: "INADEA",
        msisdn: `91${number.replace(/\s+/g, "").slice(-10)}`,
        channel: "SMS",
        campaignName: "IADA_u",
        circleName: "DLT_SERVICE_IMPLICT",
        userName: "IADA_hsi",
        dlt_pe_id: process.env.SMS_PE_ID,
        dlt_tm_id: process.env.SMS_SERVICE_PM_ID,
        dlt_ct_id: process.env.BILL_RAISED_CT_ID
      }))
    };

    payloads.push(payload);
  }

  return payloads;
};

const sendNotification = async () => {
  try {
    const phoneNumbers = await getIndustriesContact();
    if (phoneNumbers.length === 0) {
      console.log("No phone numbers found.");
      return;
    }

    const payloads = createPayloads(phoneNumbers);

    if (!process.env.SEND_SMS_URL) {
      console.error("SEND_SMS_URL is not set in environment variables.");
      return;
    }

    for (const payload of payloads) {
      try {
        const response = await fetch(process.env.SEND_SMS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("SMS API Response:", result);
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    }
  } catch (error) {
    console.error("Error in sendNotification:", error);
  }
};


module.exports = {
  sendNotification,
  getIndustriesContact
}
