import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WaterCardModal from "./WaterCardModal";
import MaintenanceCardModal from "./MaintenanceCardModal";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import BillpayImg from "../public/billPay.webp";
import MaintenanceImg from "../public/his.webp";
import PlotPremiumImg from "../public/document.webp";
import DueBillsImg from "../public/billDue.webp";
import ContactUsImg from "../public/contactUs.webp";
import axios from "axios";

function CardGroup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const closeMaintenanceModal = () => setIsMaintenanceModalOpen(false);
  const openMaintenanceModal = () => setIsMaintenanceModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("token"));
  const hashedToken = CryptoJS.SHA256(token).toString();
  const slicedToken = hashedToken.substring(0, 5);
  const [UserData, setUserData] = useState({});
  const [isWaterbillDue, setIsWaterbillDue] = useState(true);
  const [isMaintenancebillDue, setIsMaintenancebillDue] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if(cookies.get("zone_id")){
        setUserData({zone_id: cookies.get("zone_id")});
      } else {
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
            setUserData(response.data);
          } catch (e) {
            console.log(e);
          }
        }
      }
    };
    const fetchFinalWaterbill = async() => {
      if(cookies.get("userType")==="Industry_User") {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/industry/isBillDue`,
            {
              headers: {
                Authorization: `Bearer ${cookies.get("token")}`,
              },
            }
          );
          if(res.status===200){
            setIsWaterbillDue(res.data.isWaterbillDue);
            setIsMaintenancebillDue(res.data.isMaintenanceBillDue);
          } else {
            setIsWaterbillDue(false);
            setIsMaintenancebillDue(false);
          }          
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchUserData();
    fetchFinalWaterbill();
  }, []);

  return (
    <div className="flex flex-col md:p-9">
      <WaterCardModal isModalOpen={isModalOpen} closeModal={closeModal} isBillDue={isWaterbillDue} />
      <MaintenanceCardModal isModalOpen={isMaintenanceModalOpen} closeModal={closeMaintenanceModal} isBillDue={isMaintenancebillDue} />
      <div className="grid border rounded-xl shadow-sm divide-y overflow-hidden sm:flex sm:divide-y-0 sm:divide-x dark:border-neutral-700 dark:shadow-neutral-700/70 dark:divide-neutral-600 p-0 md:p-9">
        <div
          className="relative hover:scale-105 transition-transform duration-300 p-7 rounded-xl flex flex-col flex-[1_0_0%] bg-white dark:bg-neutral-800"
          onClick={UserData.zone_id == 222 ? null : openModal}
        >
          <div className="relative">
            <img
              className="w-auto h-80 rounded-xl"
              src={BillpayImg}
              alt="Water Bills"
            />
            {UserData.zone_id == 222 && (
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-50">
                <span className="text-white text-2xl font-bold px-8 text-center">
                  Water bills aren't available for your zone
                </span>
              </div>
            )}
          </div>
          <div className="p-4 flex-1 md:p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Water Bills
            </h3>
            <p className="mt-1 text-gray-500 dark:text-neutral-400">
              Pay and check your paid water bills here
            </p>
          </div>
        </div>

        <div className="relative hover:scale-105 transition-transform duration-300 p-7 rounded-xl flex flex-col flex-[1_0_0%] bg-white dark:bg-neutral-800"
        onClick={openMaintenanceModal}>
            <div className="relative">
              <img
                className="rounded-xl w-100 h-80 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                src={MaintenanceImg}
                alt="Maintenance Bills"
                loading="lazy"
              />
            </div>
            <div className="p-4 flex-1 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Maintenance Bills
              </h3>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                Pay your maintenance bills
              </p>
            </div>
        </div>

        <div className="relative hover:scale-105 transition-transform duration-300 p-7 rounded-xl flex flex-col flex-[1_0_0%] bg-white dark:bg-neutral-800">
          <Link to="#" className="relative block">
            <div className="relative">
              <img
                className="rounded-xl w-100 h-80 transition-all duration-300 grayscale opacity-50 hover:grayscale-0 hover:opacity-80"
                src={PlotPremiumImg}
                alt="Plot Premium Bills"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-70">
                <span className="text-white text-2xl font-bold">
                  Coming Soon
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Plot Premium Bills
              </h3>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                Pay your plot premium bills
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid border rounded-xl shadow-sm divide-y overflow-hidden sm:flex sm:divide-y-0 sm:divide-x dark:border-neutral-700 dark:shadow-neutral-700/70 dark:divide-neutral-600 p-7">
        <div className="relative hover:scale-105 transition-transform duration-300 md:p-7 rounded-xl flex flex-col flex-[1_0_0%] bg-white dark:bg-neutral-800">
          <Link to="#" className="relative block">
            <div className="relative">
              <img
                className="w-auto h-80 rounded-xl transition-all duration-300 grayscale opacity-50 hover:grayscale-0 hover:opacity-80"
                src={BillpayImg}
                alt="Constituency Change"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-70">
                <span className="text-white text-2xl font-bold">
                  Coming Soon
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Constituency Change
              </h3>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                Read our constituency change policy
              </p>
            </div>
          </Link>
        </div>

        <div className="relative hover:scale-105 transition-transform duration-300 md:p-7 rounded-xl flex flex-col flex-[1_0_0%] bg-white dark:bg-neutral-800">
          <Link className="relative block">
            <div className="relative">
              <img
                className="rounded-xl w-100 h-80 transition-all duration-300 grayscale opacity-50 hover:grayscale-0 hover:opacity-80"
                src={DueBillsImg}
                alt="Due Bills & Fines"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-70">
                <span className="text-white text-2xl font-bold">
                  Coming Soon
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Due Bills & Fines
              </h3>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                Check the due bills and fines
              </p>
            </div>
          </Link>
        </div>

        <div className="relative hover:scale-105 transition-transform duration-300 md:p-7 rounded-xl flex flex-col flex-[1_0_0%] bg-white dark:bg-neutral-800">
          <Link to={`/services/user/${slicedToken}/help-desk`}>
            <img
              className="rounded-xl w-100 h-80"
              src={ContactUsImg}
              alt="Contact Us"
              loading="lazy"
            />
            <div className="p-4 flex-1 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Contact Us
              </h3>
              <p className="mt-1 text-gray-500 dark:text-neutral-400">
                Contact us for any help & complaints
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardGroup;
