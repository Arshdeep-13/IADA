const otpGenerator = require("otp-generator");
const OTP = require("../models/otpModel");

const generateOtp = async (email) => {
  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpBody = await OTP.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    );
    return otp;
  } catch (error) {
    throw new Error("Error generating OTP: " + error.message);
  }
};

const sendOtpOnPhone = async (phone, email) => {
  try {
    const otp = await generateOtp(email);
    console.log("OTP: ", otp, phone, email);
    const phone_number = phone.replace(/\s+/g, "").slice(-10);
    const timeStamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const payload = {
      keyword: "digimate",
      timestamp: timeStamp,
      dataSet: [
        {
          message: `Industrial Area Development Agency- Your OTP for verification is: ${otp}`,
          oa: "INADEA",
          msisdn: `91${phone_number}`,
          channel: "SMS",
          campaignName: "IADA_u",
          circleName: "DLT_SERVICE_IMPLICT",
          userName: "IADA_hsi",
          dlt_tm_id: process.env.SMS_SERVICE_TM_ID,
          dlt_ct_id: process.env.OTP_CT_ID,
          dlt_pe_id: process.env.SMS_PE_ID,
        },
      ],
    };

    const response = await fetch(process.env.SEND_SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    throw new Error("Error in sendOtpOnPhone: " + error.message);
  }
};

module.exports = { sendOtpOnPhone };
