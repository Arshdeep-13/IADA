const express = require("express");
const app = express();
const dbConnect = require("./config/db");
const industryRoutes = require("./routes/industryRoute");
const zoneRoutes = require("./routes/zoneRoute");
const otpRoutes = require("./routes/otpRoute");
const zAdminRoutes = require("./routes/ZadminRoute");
const authRoutes = require("./routes/authRoute");
const { router: fincanceRoutes } = require("./routes/financeRoute");
const paymentRoute = require("./routes/paymentRoute");
const alertUpdateRoute = require("./routes/alertUpdateRoute");
const passwordResetRoute = require("./routes/passwordReset");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const waterBillScheduler = require("./billScheduler/waterBillScheduler");
app.use("/userDocument", express.static("IndustryRegUpload"));
app.use("/industrydocument", express.static("DocumentUpload"));
const configRoute = require("./routes/configRoute");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const compression = require("compression");
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

dbConnect();

waterBillScheduler();

app.use("/", configRoute);
app.use("/api/auth", authRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/zone", zoneRoutes);
app.use("/api/zAdmin", zAdminRoutes);
app.use("/api/sendOtp", otpRoutes);
app.use("/api/forgotpassword", passwordResetRoute);
app.use("/api/finances", fincanceRoutes);
app.use("/api/news", alertUpdateRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/generate-encrypted-url", paymentRoute);
app.use("/waterbill-payment", paymentRoute);

server.listen(8000, () => {
  console.log("Server active");
});
