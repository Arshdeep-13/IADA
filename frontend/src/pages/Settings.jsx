import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import village from "../assets/webpImages/village.webp";

const Settings = () => {
  const [userData, setUserData] = useState({});
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("token"));

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Decode token to get the payload
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // Check if token is expired
          if (decodedToken.exp < currentTime) {
            cookies.remove("token");
            console.log("token expired");
            window.location.href = "/login";
          } else {
            // Verify token with server
            const response = await axios.post(
              `${import.meta.env.VITE_SERVER}/api/auth/verifyToken`,
              { token }
            );
            if (response.data.valid) {
              fetchUserData();
            } else {
              cookies.remove("token", { path: "/" });
              cookies.remove("userType", { path: "/" });
              cookies.remove("username", { path: "/" });
              cookies.remove("zone_id", { path: "/" });
              cookies.remove("admin_type", { path: "/" });
              cookies.remove("admin_id", { path: "/" });
              cookies.remove("email", { path: "/" });
              cookies.remove("zone", { path: "/" });
              console.log("invalid token");
              window.location.href = "/login";
            }
          }
        } catch (error) {
          console.error("Invalid token:", error);
          cookies.remove("token", { path: "/" });
          console.log("invalid token");
        }
      }
    };
    verifyToken();
  }, [token]);

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
        setUserData(response.data);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/zAdmin/getAdminData/`,
          {
            params: {
              id: cookies.get("admin_id"),
            },
          }
        );
        setUserData(response.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container relative flex flex-col justify-center items-center md:flex-row mx-auto p-6">
        <img
          className="w-full pt-2 rounded-3xl h-full object-cover absolute -z-50 brightness-90 opacity-90"
          src={village}
          alt="Settings Illustration"
        />
        <div className="flex flex-col md:w-4/5 md:p-6">
          <div className="brightness-100 backdrop-blur-lg shadow-md rounded-lg p-6 flex flex-col justify-center items-stretch border border-white">
            <div className="text-center backdrop-blur-sm bg-transparent text-2xl md:text-3xl font-bold mb-6 flex justify-center items-center">
              <h1
                id="a"
                className="text-white p-6 relative w-fit text-3xl md:text-4xl"
              >
                Settings
              </h1>
            </div>
            {cookies.get("userType") === "Industry_User" && (
              <div className="text-white grid md:grid-cols-2 gap-4">
                <p className="text-base md:text-lg">
                  <strong className=" underline underline-offset-2">
                    Name:
                  </strong>{" "}
                  {userData.name}
                </p>
                <p className="break-all text-base md:text-lg">
                  <strong className=" underline underline-offset-2">
                    Email:
                  </strong>{" "}
                  {userData.email}
                </p>
                <p className=" text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Phone Number:
                  </strong>{" "}
                  {userData.phone_number}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Industry Name:
                  </strong>{" "}
                  {userData.industry_name}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Industry Area:
                  </strong>{" "}
                  {userData.industry_area}
                </p>
                
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Total Number of Employees:
                  </strong>{" "}
                  {userData.no_of_employees}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Number of Employees HIM:
                  </strong>{" "}
                  {userData.no_of_employees_HIM}
                </p>

                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Lessee:
                  </strong>{" "}
                  {userData.lessee}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Item Manufactured:
                  </strong>{" "}
                  {userData.item_manufactured}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Consumer Number:
                  </strong>{" "}
                  {userData.consumerNo}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Water Meter Number:
                  </strong>{" "}
                  {userData.meterNo}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    GSTIN Number:
                  </strong>{" "}
                  {userData.gstin_number}
                </p>
              </div>
            )}
            {(cookies.get("admin_type") === "zonal_admin" ||
              cookies.get("admin_type") === "master_admin") && (
              <div className="grid grid-cols-2 gap-4 text-white">
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Name:
                  </strong>{" "}
                  {userData.admin_name}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Email:
                  </strong>{" "}
                  {userData.admin_email}
                </p>
                <p className="text-base md:text-lg">
                  <strong className="underline underline-offset-2">
                    Phone Number:
                  </strong>{" "}
                  {userData.phone_number}
                </p>
              </div>
            )}
            <Link to="/settings/edit">
              <button className="mt-8 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all duration-200 ease-in-out">
                Edit Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
