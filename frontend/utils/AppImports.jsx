import { lazy } from "react";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

import LandingPage from "../src/pages/LandingPage";
const RegisterIndustry = lazy(() => import("../src/pages/RegisterIndustry"));
const Login = lazy(() => import("../src/pages/Login"));
const ZonalAdminDashboard = lazy(() =>
  import("../src/pages/ZonalAdminDashboard")
);
const IndustryUserDashboard = lazy(() =>
  import("../src/pages/IndustryUserDashboard")
);
const MasterAdminDashboard = lazy(() =>
  import("../src/pages/MasterAdminDashboard")
);
const PaymentHistory = lazy(() => import("../src/pages/PaymentHistory.jsx"));
const ZonePaymentHistory = lazy(() =>
  import("../src/pages/ZonePaymentHistory.jsx")
);
const PageNotFound = lazy(() => import("../src/pages/PageNotFound"));
const UploadDocument = lazy(() => import("../src/pages/UploadDocument"));
const WaterBills = lazy(() => import("../src/pages/WaterBills"));
const UserChatCard = lazy(() => import("../src/components/UserChatCard"));
const AdminChatCard = lazy(() => import("../src/components/AdminChatCard"));
const IndustrymadminChatCard = lazy(() =>
  import("../src/components/IndustrymadminChatCard.jsx")
);
const MasteradminChatCard = lazy(() =>
  import("../src/components/MasterAdmin/MasteradminChatCard.jsx")
);
const IndustryDetails = lazy(() => import("../src/pages/IndustryDetails.jsx"));
const Usercontactus = lazy(() =>
  import("../src/components/UsercontactusPage.jsx")
);
const Settings = lazy(() => import("../src/pages/Settings"));
const SettingsEdit = lazy(() => import("../src/pages/SettingsEdit"));
const PlotPremiumBills = lazy(() =>
  import("../src/pages/PlotPremiumBills.jsx")
);
const WaterBillController = lazy(() =>
  import("../src/pages/WaterBillController.jsx")
);
const ZonalAdminBills = lazy(() =>
  import("../src/components/ZonalAdminBills.jsx")
);
const ZAdminDetails = lazy(() => import("../src/pages/ZAdminDetails.jsx"));
const WaterBillNotRaised = lazy(() =>
  import("../src/pages/WaterBillNotRaised")
);
const MaintenanceBillNotRaised = lazy(() => import ("../src/pages/MaintenanceBillNotRaised"));
const Masteradminwaterbills = lazy(() =>
  import("../src/components/MasterAdmin/Masteradminwaterbills.jsx")
);
const Zonaladmincheckdoc = lazy(() =>
  import("../src/pages/Zonaladmincheckdoc.jsx")
);
const IndustryAlerts = lazy(() => import("../src/pages/IndustryAlerts.jsx"));
const Zonaladminuploaddoc = lazy(() =>
  import("../src/pages/Zonaladminuploaddoc.jsx")
);
const Masteradmincheckdoc = lazy(() =>
  import("../src/components/MasterAdmin/Masteradmincheckdoc.jsx")
);
const MasterAdminPayments = lazy(() => 
  import("../src/components/MasterAdmin/MasterAdminPayments.jsx")
)
const PaymentSuccess = lazy(() => import("../src/pages/PaymentSuccess.jsx"));
const PaymentFaliure = lazy(() => import("../src/pages/PaymentFaliure.jsx"));
const IndustryImageUploads = lazy(() =>
  import("../src/pages/IndustryImageUploads.jsx")
);
const Zonaladmingallery = lazy(() =>
  import("../src/pages/Zonaladmingallery.jsx")
);
const ZonalPaymentHistory = lazy(() => 
  import("../src/pages/ZonalPaymentHistory.jsx")
)
const ZonaladminconsImage = lazy(() =>
  import("../src/pages/ZonaladminconsImage.jsx")
);
const Unregistertable = lazy(() =>
  import("../src/components/MasterAdmin/Unregistertable.jsx")
);
const Maindustrydetails = lazy(() =>
  import("../src/components/MasterAdmin/MaIndustrydetails.jsx")
);
const ZonalAlerts = lazy(() => import("../src/pages/ZonalAlerts.jsx"));
const WaterBillControl = lazy(() =>
  import("../src/pages/WaterBillController.jsx")
);
const About = lazy(() => import("../src/pages/About.jsx"));
const Contact = lazy(() => import("../src/pages/Contact.jsx"));
const TermsConditionsPage = lazy(() =>
  import("../src/pages/TermsConditionsPage.jsx")
);
const DevTeamPage = lazy(() => import("../src/pages/DevTeamPage.jsx"));

export {
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
  ZonalPaymentHistory,
  ZAdminDetails,
  WaterBillNotRaised,
  MaintenanceBillNotRaised,
  Masteradminwaterbills,
  Zonaladmincheckdoc,
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
  MasterAdminPayments,
  ZonalAlerts,
  WaterBillControl,
  About,
  Contact,
  TermsConditionsPage,
  DevTeamPage,
};
