import Carousel from "../components/Carousel";
import NewsCard from "../components/NewsCard";
import GovernmentDirectories from "../components/GovernmentDirectories";
import About from "../components/About";
import FeaturedGallery from "../components/FeaturedGallery";
import Cookies from "universal-cookie";
import FabButton from "../components/FABbutton";
import { FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Ashoka_Chakra from "../public/Ashoka_Chakra.svg";
import EaseOfBusiness from "../components/EaseOfBusiness";
import LionComponent from "../components/LionComponent";
import QualitiesWheel from "../components/QualitiesWheel";
import { PopUpModal } from "../components/PopUpModal";
import { ModalProvider } from "../components/AnimatedModal";

function LandingPage({ isAuth, userType }) {
  const cookies = new Cookies();
  const zone_id = useState(cookies.get("zone_id"));
  const zone_id2 = cookies.get("zone_id");
  const [token, setToken] = useState(cookies.get("token"));
  const decodedToken = token ? jwtDecode(token) : {};
  const industry_id = decodedToken.industryId;
  const admin_type = cookies.get("admin_type");
  const nav = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasCustomerNoAndPlotNumber, setHasCustomerNoAndPlotNumber] =
    useState(false);

  if (industry_id) {
    useEffect(() => {
      const fetchAlertsSummary = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_SERVER
            }/api/news/${industry_id}/alerts-summary`
          );
          setUnreadCount(response.data.numUnreadAlerts);
        } catch (error) {
          console.error(
            "Error fetching alerts summary:",
            error.response.data.message
          );
        }
      };

      fetchAlertsSummary();
    }, [industry_id]);
  }
  if (admin_type) {
    useEffect(() => {
      const fetchAlertsSummary = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_SERVER
            }/api/news/admin-alerts-summary/${zone_id2}`
          );
          setUnreadCount(response.data.numUnreadAlerts);
        } catch (error) {
          console.error(
            "Error fetching alerts summary:",
            error.response.data.message
          );
        }
      };

      fetchAlertsSummary();
    }, [zone_id2]);
  }

  const handleFabClick = () => {
    nav(`/industry-alerts/${industry_id}`);
  };
  const handleFabZonalClick = () => {
    nav(`/zonal-alerts`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (cookies.get("userType") === "Industry_User") {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/industry/getIndustryData`,
            {
              headers: {
                authorization: `Bearer ${cookies.get("token")}`,
              },
            }
          );
          if (!response.data.consumerNo || !response.data.plot_number) {
            setHasCustomerNoAndPlotNumber(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="relative bg-white">
      <ModalProvider>
        {setHasCustomerNoAndPlotNumber && (
          <PopUpModal isTriggered={hasCustomerNoAndPlotNumber} />
        )}
      </ModalProvider>
      {isAuth && userType === "Industry_User" ? (
        <FabButton
          onClick={handleFabClick}
          icon={<FaComment />}
          badgeCount={unreadCount}
        />
      ) : null}
      {isAuth && admin_type === "zonal_admin" ? (
        <FabButton
          onClick={handleFabZonalClick}   
          icon={<FaComment />}
          badgeCount={unreadCount}
        />
      ) : null}

      <Carousel />
      <About />
      <div
        className="absolute top-96 z-0 opacity-20 rotate-animation w-[50%] h-[50%] max-w-[680px] max-h-[680px] -translate-y-1/2"
        style={{
          width: "50%",
          height: "50%",
        }}
      >
        <img
          src={Ashoka_Chakra}
          alt="Ashoka Chakra"
          style={{
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
      </div>

      {/* <NewsCard /> */}

      {!isAuth || (isAuth && admin_type === "master_admin") ? (
        <FeaturedGallery isAuth={isAuth} zone_id="123" />
      ) : (isAuth && userType === "Industry_User") ||
        (isAuth && admin_type === "zonal_admin") ? (
        <FeaturedGallery zone_id={zone_id} />
      ) : null}

      {isAuth && userType === "Industry_User" ? (
        <div className="flex flex-wrap-reverse justify-center items-center p-5 gap-5">
          <span
            htmlFor="upload-images"
            className="md:text-lg font-semibold md:text-center text-justify"
          >
            Upload upto 5 images of the improvements made in your area. These
            may appear in your home page after approval from your admin
          </span>
          <button
            id="upload-images"
            onClick={() => nav("/industry-image-upload")}
            className="relative rounded px-5 py-2.5 overflow-hidden group bg-blue-500 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">Upload Images</span>
          </button>
        </div>
      ) : null}

      {/* <EaseOfBusiness /> */}
      {/* <LionComponent /> */}
      {/* <QualitiesWheel /> */}
      <GovernmentDirectories />

      <style>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .rotate-animation {
          animation: rotate 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
