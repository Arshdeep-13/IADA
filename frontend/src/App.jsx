import React, { useEffect, useState, Suspense } from "react";
import RingLoader from "react-spinners/RingLoader";
import {
  Navbar,
  Footer,
  LandingPage,
  RegisterIndustry,
  Login,
  ZonalAdminDashboard,
  IndustryUserDashboard,
  MasterAdminDashboard,
  PaymentHistory,
  ZonePaymentHistory,
  PageNotFound,
  UploadDocument,
  WaterBills,
  UserChatCard,
  AdminChatCard,
  IndustrymadminChatCard,
  MasteradminChatCard,
  IndustryDetails,
  Usercontactus,
  Settings,
  SettingsEdit,
  PlotPremiumBills,
  WaterBillController,
  ZonalAdminBills,
  ZAdminDetails,
  WaterBillNotRaised,
  MaintenanceBillNotRaised,
  Masteradminwaterbills,
  Zonaladmincheckdoc,
  MasterAdminPayments,
  IndustryAlerts,
  Zonaladminuploaddoc,
  Masteradmincheckdoc,
  PaymentSuccess,
  PaymentFaliure,
  IndustryImageUploads,
  Zonaladmingallery,
  ZonaladminconsImage,
  Unregistertable,
  Maindustrydetails,
  ZonalAlerts,
  WaterBillControl,
  About,
  Contact,
  TermsConditionsPage,
  DevTeamPage,
  ZonalPaymentHistory,
} from "../utils/AppImports";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CryptoJS from "crypto-js";
import TestPayment from "./components/TestPayment.jsx";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const cookies = new Cookies();
  const adminType = cookies.get("admin_type");
  const userType = cookies.get("userType");
  const [token, setToken] = useState(cookies.get("token"));
  const hashedToken = CryptoJS.SHA256(token).toString();
  const slicedToken = hashedToken.substring(0, 5);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    cookies.remove("token", { path: "/" });
    cookies.remove("userType", { path: "/" });
    cookies.remove("username", { path: "/" });
    cookies.remove("zone_id", { path: "/" });
    cookies.remove("admin_type", { path: "/" });
    cookies.remove("admin_id", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("zone", { path: "/" });
    setIsAuth(false);
    setIsLoading(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Decode token to get the payload
          setIsLoading(true);
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // Check if token is expired
          if (decodedToken.exp < currentTime) {
            cookies.remove("token", { path: "/" });
            setIsAuth(false);
            logout();
          } else {
            // Verify token with server
            const response = await axios.post(
              `${import.meta.env.VITE_SERVER}/api/auth/verifyToken`,
              { token }
            );
            if (response.data.valid) {
              setIsAuth(true);
              setIsLoading(false);
            } else {
              setIsAuth(false);
              cookies.remove("token"), { path: "/" };
              logout();
            }
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setIsAuth(false);
          setIsLoading(false);
          cookies.remove("token", { path: "/" });
          logout();
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [token]);

  const [showWaterBillNotification, setShowWaterBillNotification] =
    useState(true);
  useEffect(() => {
    const socket = new WebSocket("https://socket.iadabaddi.com");

    socket.onmessage = (event) => {
      if (event.data === "Water bill generated") {
        setShowWaterBillNotification(true);
      }
    };
    return () => socket.close();
  }, []);

  const handlePayNow = () => {
    setShowWaterBillNotification(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }
  const override = {
    display: "block",
    margin: "0 auto",
    paddingBottom: "120px",
  };

  return (
    <Router>
      <Navbar />
      <Suspense
        fallback={
          <div className="h-screen flex justify-center items-center">
            <RingLoader cssOverride={override} color="#2980b9" size={150} />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={<LandingPage isAuth={isAuth} userType={userType} />}
          />
          <Route
            path="/home"
            element={<LandingPage isAuth={isAuth} userType={userType} />}
          />

          <Route
            path="/industry-alerts/:_id"
            element={
              isAuth && userType === "Industry_User" ? (
                <IndustryAlerts />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/zonal-alerts"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <ZonalAlerts />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route path="/termsandconditions" element={<TermsConditionsPage />} />

          <Route
            path="/waterbill" //path may be altered upon complete setup
            element={
              <>
                {isAuth && userType === "Industry_User" ? (
                  showWaterBillNotification ? (
                    <WaterBills onPayNow={handlePayNow} /> //need to enter 'isDue' check here for final h20 bill.
                  ) : (
                    <WaterBillNotRaised />
                  )
                ) : (
                  //add condition that if time got not raised
                  <PageNotFound />
                )}
              </>
            }
          />
          <Route
            path="/waterbillnotraised" //path may be altered upon complete setup
            element={
              isAuth && userType === "Industry_User" ? (
                <WaterBillNotRaised />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/mtcbillnotraised" //path may be altered upon complete setup
            element={
              isAuth && userType === "Industry_User" ? (
                <MaintenanceBillNotRaised />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/industry-image-upload" //path may be altered upon complete setup
            element={
              isAuth && userType === "Industry_User" ? (
                <IndustryImageUploads />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route path="/devs" element={<DevTeamPage />} />

          <Route
            path="/payment-success"
            element={
              isAuth && userType === "Industry_User" ? (
                <PaymentSuccess />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/payment-failure"
            element={
              isAuth && userType === "Industry_User" ? (
                <PaymentFaliure />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/plot-premium" //path may be altered upon complete setup
            element={
              isAuth && userType === "Industry_User" ? (
                <PlotPremiumBills />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route path="/industryregister" element={<RegisterIndustry />} />
          <Route
            path="/user/upload"
            element={
              isAuth && userType === "Industry_User" ? (
                <UploadDocument />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/login"
            element={isAuth == true ? <LandingPage /> : <Login />}
          />
          <Route
            path="/services/admins/:zone_id/zonaladmin"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <ZonalAdminDashboard />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/admins/:zone_id/zonaladmin/upload-document"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <Zonaladminuploaddoc />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/admins/:zone_id/zonaladmin/gallery"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <Zonaladmingallery />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/admins/:zone_id/zonaladmin/check-image"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <ZonaladminconsImage />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/user/:_id"
            element={
              isAuth && userType === "Industry_User" ? (
                <IndustryUserDashboard />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />

          <Route
            path="/services/payment-history"
            element={
              isAuth && userType === "Industry_User" ? (
                <PaymentHistory />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/admins/masteradmin"
            element={
              isAuth && adminType === "master_admin" ? (
                <MasterAdminDashboard />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/admins/masteradmin/:zone_id/:industry_type/industry"
            element={
              isAuth && adminType === "master_admin" ? (
                <Unregistertable />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path="/services/admins/masteradmin/checkdocument"
            element={
              isAuth && adminType === "master_admin" ? (
                <Masteradmincheckdoc />
              ) : (
                <PageNotFound />
              )
            } //isAuth being checked in the navbar
          />
          <Route
            path={`/services/user/${slicedToken}/help-desk`}
            element={
              isAuth && userType === "Industry_User" ? (
                <Usercontactus />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path={`/services/user/${slicedToken}/chat`}
            element={
              isAuth && userType === "Industry_User" ? (
                <UserChatCard />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/services/admins/masteradmin/waterbills"
            element={
              isAuth && adminType === "master_admin" ? (
                <Masteradminwaterbills />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/services/admins/masteradmin/payments"
            element={
              isAuth && adminType === "master_admin" ? (
                <MasterAdminPayments />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/services/admins/:zone_id/zonaladmin/chat"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <AdminChatCard />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/services/admins/:zone_id/zonaladmin/upload_bills"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <ZonalAdminBills />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/services/admins/:zone_id/zonaladmin/showbills"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <ZonePaymentHistory />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/services/admins/:zone_id/zonaladmin/paymentHistory"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <ZonalPaymentHistory />
              ) : (
                <PageNotFound />
              )
            }
          />

          <Route
            path="/services/admins/:zone_id/zonaladmin/checkdocument"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <Zonaladmincheckdoc />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/services/admins/:zone_id/zonaladmin/chat-admin"
            element={
              isAuth && adminType === "zonal_admin" ? (
                <IndustrymadminChatCard />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/services/admins/masteradmin/chat"
            element={
              isAuth && adminType === "master_admin" ? (
                <MasteradminChatCard />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/industry/:_id"
            element={
              isAuth && userType !== "Industry_User" ? (
                <IndustryDetails />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/master-admin/industry/:_id"
            element={
              isAuth && adminType === "master_admin" ? (
                <Maindustrydetails />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/zadmin/:_id"
            element={
              isAuth && adminType === "master_admin" ? (
                <ZAdminDetails />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route path="*" element={<PageNotFound />} />
          {/* <Route */}

          <Route
            path="/settings"
            element={isAuth ? <Settings /> : <PageNotFound />}
          />
          <Route
            path="/settings/edit"
            element={isAuth ? <SettingsEdit /> : <PageNotFound />}
          />
          <Route
            path="/services/admins/masteradmin/waterbillconfig"
            element={
              isAuth && adminType === "master_admin" ? (
                <WaterBillControl />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/waterbill-payment" element={<TestPayment />}></Route>
          <Route
            path="/waterbill-payment/processing"
            element={<TestPayment />}
          ></Route>
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
