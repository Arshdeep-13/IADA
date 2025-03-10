const cron = require("node-cron");
const WebSocket = require("ws");
const axios = require("axios");
const { sendNotification } = require("../utils/billRaisedNotification");
const wss = new WebSocket.Server({ port: 9090 });

//the purpose of the scheduler is to show the bill to the users on the appropriate dates.

const fetchData = async () => {
  try {
    const res = await axios.get(
      "https://backend.iadabaddi.com/api/waterbill/getFinances"
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

async function startWaterBillScheduler() {
  const data = await fetchData();
  if (!data || !data.billRaisingDate || !data.duration) {
    console.error("Invalid data received from API");
    return;
  }

  const billRaisingDate = data.billRaisingDate;
  const duration = data.duration;

  scheduleCronJob(billRaisingDate, duration);
}

function scheduleCronJob(billRaisingDate, duration) {
  const currentDate = new Date();
  let nextDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    billRaisingDate
  ); //date on which the bill will be raised

  if (currentDate > nextDate) {
    nextDate.setMonth(nextDate.getMonth() + duration); // Move to the next duration(in months) if the date has passed
  }

  const day = nextDate.getDate();
  const month = nextDate.getMonth() + 1; // Cron months are 1-12

  // `day` and `month` are used in the cron expression
  const cronExpression = `0 0 ${day} ${month} *`;
  cron.schedule(
    cronExpression,
    () => {
      generateWaterBill();
      sendNotification();
      nextDate.setMonth(nextDate.getMonth() + duration);
    },
    {
      scheduled: true,
    }
  );
}
//this shows the waterbill at the set time
function generateWaterBill() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("Water bill generated");
    }
  });
}

module.exports = startWaterBillScheduler;
