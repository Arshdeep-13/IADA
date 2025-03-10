import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/headingStyles.css";

const SettingsEdit = () => {
  const [userData, setUserData] = useState({
    name: "",
    industry_name: "",
    email: "",
    phone_number: "",
    industry_area: "",
    no_of_employees: "",
    no_of_employees_HIM: "",
    lessee: "",
    item_manufactured: "",
    gstin_number: "",
    zone_id: "",
    admin_email: "",
    admin_name: "",
    consumerNo: "",
    meterNo: "",
  });
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [EmailVerified, setEmailVerified] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);
  const [gstValid, setGSTValid] = useState(true);

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
    fetchUserData();
  }, []);

  useEffect(() => {
    handlePhoneChange(userData.phone_number);
  }, [userData.phone_number]);
  const handlePhoneChange = (e) => {
    setPhoneValid(/^[6789]\d{9}$/.test(e));
  };

  useEffect(() => {
    handleGSTchange(userData.gstin_number);
  }, [userData.gstin_number]);
  const handleGSTchange = (e) => {
    const gstinPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    setGSTValid(gstinPattern.test(e));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (cookies.get("userType") === "Industry_User") {
      try {
        await axios.put(
          `${import.meta.env.VITE_SERVER}/api/industry/updateIndustryData`,
          {
            industry_email: cookies.get("email"),
            industry_name: userData.industry_name,
            phone_number: userData.phone_number,
            industry_area: userData.industry_area,
            plot_number: userData.plot_number,
            no_of_employees: userData.no_of_employees,
            no_of_employees_HIM: userData.no_of_employees_HIM,
            lessee: userData.lessee,
            item_manufactured: userData.item_manufactured,
            gstin_number: userData.gstin_number,
            consumerNo: userData.consumerNo,
            meterNo: userData.meterNo,
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        navigate("/settings", {
          state: { toast: "success", message: "Changes saved successfully" },
        });
      } catch (e) {
        console.log(e);
        navigate("/settings", {
          state: { toast: "error", message: "Failed to save changes" },
        });
      }
    } else {
      try {
        await axios.put(
          `${import.meta.env.VITE_SERVER}/api/zAdmin/updateAdminData`,
          {
            id: cookies.get("admin_id"),
            admin_email: userData.admin_email,
            admin_name: userData.admin_name,
            phone_number: userData.phone_number,
          }
        );
        navigate("/settings", {
          state: { toast: "success", message: "Changes saved successfully" },
        });
      } catch (e) {
        console.log(e);
        navigate("/settings", {
          state: { toast: "error", message: "Failed to save changes" },
        });
      }
    }
  };

  const handleEmailSend = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let sendOtp = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/send-otp`,
        {
          email: userData.email || userData.admin_email,
          config,
        }
      );
      if (sendOtp.data.success) {
        toast.success(sendOtp.data.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(sendOtp.data.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log("Error" + error);
    }
  };
  const handleEmailVerify = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let sendOtp = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/verify-otp`,
        {
          otp: emailOtp,
          email: userData.email || userData.admin_email,
          config,
        }
      );
      if (sendOtp.data.success) {
        setEmailVerified(true);
        toast.success(sendOtp.data.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        setEmailVerified(false);
        toast.error(sendOtp.data.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
      <div className="container mx-auto p-6">
        <div className="text-center text-2xl md:text-3xl font-bold mb-6 flex justify-center items-center">
          <h1 id="heading" className="cursor-pointer w-fit ">
            Edit User Details
          </h1>
        </div>
        {cookies.get("userType") === "Industry_User" && (
          <div className="bg-white shadow-xl rounded-lg p-6">
            <form className="space-y-4">
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Industry Name
                </label>
                <input
                  type="text"
                  name="industry_name"
                  value={userData.industry_name}
                  onChange={(e) =>
                    setUserData({ ...userData, industry_name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Industry Email
                </label>
                <input
                  type="email"
                  name="industry_email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={(e) =>
                    setUserData({ ...userData, phone_number: e.target.value })
                  }
                  maxLength={10}
                  title="Phone number should be 10 digits long."
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {!phoneValid && userData.phone_number.length > 0 && (
                  <p className="text-red-600 text-xs mt-1" id="phone-error">
                    Please enter a valid phone number.
                  </p>
                )}
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Industry Area In Square Metres
                </label>
                <input
                  type="text"
                  name="industry_area"
                  value={userData.industry_area}
                  onChange={(e) =>
                    setUserData({ ...userData, industry_area: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Number of Employees
                </label>
                <input
                  type="text"
                  name="plot_number"
                  value={userData.no_of_employees}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      no_of_employees: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Number of Employees HIM
                </label>
                <input
                  type="text"
                  name="plot_number"
                  value={userData.no_of_employees_HIM}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      no_of_employees_HIM: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Lessee
                </label>
                <input
                  type="text"
                  name="lessee"
                  value={userData.lessee}
                  onChange={(e) =>
                    setUserData({ ...userData, lessee: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Item Manufactured
                </label>
                <input
                  type="text"
                  name="item_manufactured"
                  value={userData.item_manufactured}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      item_manufactured: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Consumer Number for Water Bill
                </label>
                <input
                  type="text"
                  name="consumerNo"
                  value={userData.consumerNo ? userData.consumerNo : ""}
                  placeholder="Please Enter Your Consumer Number"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      consumerNo: e.target.value,
                    })
                  }
                  className="placeholder-red-500 w-full p-2 border border-gray-300 rounded"
                />
                {userData.consumerNo && userData?.consumerNo.length === 0 && (
                  <p className="text-red-600 text-xs mt-1" id="consumer-error">
                    Please enter your Consumer Number.
                  </p>
                )}
              </div>
              <div>
                <label className=" block font-semibold text-base md:text-lg">
                  Water Meter Number
                </label>
                <input
                  type="text"
                  name="meterNo"
                  value={userData.meterNo ? userData.meterNo : ""}
                  placeholder="Please Enter Your Meter Number"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      meterNo: e.target.value,
                    })
                  }
                  className="placeholder-red-500 w-full p-2 border border-gray-300 rounded"
                />
                {userData.meterNo && userData.meterNo?.length === 0 && (
                  <p className="text-red-600 text-xs mt-1" id="meter-error">
                    Please enter your Meter Number.
                  </p>
                )}
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  GSTIN
                </label>
                <input
                  type="text"
                  name="gstin_number"
                  value={userData.gstin_number}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      gstin_number: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {!gstValid && userData.gstin_number.length > 0 && (
                  <p className="text-red-600 text-xs mt-1" id="gstin-error">
                    Please enter a valid GST number.
                  </p>
                )}
              </div>
              {!EmailVerified && (
                <div>
                  <label htmlFor="otp" className="font-semibold">
                    Enter OTP:
                  </label>
                  <input
                    type="text"
                    className="ml-2 p-2 border border-gray-300 rounded"
                    id="otp"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                  />
                </div>
              )}
              <div className="flex justify-between">
                {EmailVerified ? (
                  <button
                    onClick={(e) => handleSaveChanges(e)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all ease-in-out duration-300"
                  >
                    Save Changes
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleEmailSend(e)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all ease-in-out duration-300"
                    >
                      Send OTP
                    </button>
                    <button
                      onClick={(e) => handleEmailVerify(e)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all ease-in-out duration-300"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
                <Link to="/settings">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 hover:scale-110 transition-all ease-in-out duration-300"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        )}
        {(cookies.get("admin_type") === "zonal_admin" ||
          cookies.get("admin_type") === "master_admin") && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <form className="space-y-4">
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Name
                </label>
                <input
                  type="text"
                  name="admin_name"
                  value={userData.admin_name}
                  onChange={(e) =>
                    setUserData({ ...userData, admin_name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Email
                </label>
                <input
                  type="email"
                  name="admin_email"
                  value={userData.admin_email}
                  onChange={(e) =>
                    setUserData({ ...userData, admin_email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-base md:text-lg">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={userData.phone_number}
                  maxLength={10}
                  title="Phone number should be 10 digits long."
                  onChange={(e) =>
                    setUserData({ ...userData, phone_number: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />{" "}
                {!phoneValid && userData.phone_number.length > 0 && (
                  <p className="text-red-600 text-xs mt-1" id="phone-error">
                    Please enter a valid phone number.
                  </p>
                )}
              </div>
              {userData.zone_id && (
                <div>
                  <label className="block font-semibold text-base md:text-lg">
                    Zone ID
                  </label>
                  <input
                    type="text"
                    name="zone_id"
                    disabled
                    value={userData.zone_id}
                    onChange={(e) =>
                      setUserData({ ...userData, admin_email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              {!EmailVerified && (
                <div>
                  <label className="font-semibold" htmlFor="otp">
                    Enter OTP:
                  </label>
                  <input
                    type="text"
                    className="ml-2 p-2 border border-gray-300 rounded"
                    id="otp"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                  />
                </div>
              )}
              <div className="flex justify-between items-center">
                {EmailVerified ? (
                  <button
                    onClick={(e) => handleSaveChanges(e)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all ease-in-out duration-300"
                  >
                    Save Changes
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleEmailSend(e)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all ease-in-out duration-300"
                    >
                      Send OTP
                    </button>
                    <button
                      onClick={(e) => handleEmailVerify(e)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:scale-110 transition-all ease-in-out duration-300"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
                <Link to="/settings">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 hover:scale-x-105 transition-all duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsEdit;
