import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegistrationModal from "../components/RegistrationModal";

function RegisterIndustry() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [phone_number, setPhone] = useState("");
  const [zoneOptions, setZoneOptions] = useState([]);
  const [industryName, setIndustryName] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [industryArea, setIndustryArea] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [lessee, setLessee] = useState("");
  const [itemManufactured, setItemManufactured] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [no_of_employees, setno_of_employees] = useState("");
  const [no_of_employees_HIM, setno_of_employees_HIM] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [termsAndCond, setTermsAndCond] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [gstValid, setGSTValid] = useState(true);
  const [sendEmailOtp, setSendEmailOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [disableMailButton, setDisableMailButton] = useState(false);

  useEffect(() => {
    // Fetch Zone Options
    axios
      .get(`${import.meta.env.VITE_SERVER}/api/zone`)
      .then((response) => {
        setZoneOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching zone options:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(e.target.files[0].type)) {
      alert("Invalid file type. Please select an image file.");
      e.target.value = "";
    }
  };
  const handleZoneChange = (e) => {
    const selectedZoneId = e.target.value;
    const selectedZone = zoneOptions.find(
      (option) => option.zone_id == selectedZoneId
    );

    if (selectedZone) {
      setZoneId(selectedZoneId);
      setZoneName(selectedZone.zone_name);
    } else {
      setZoneId("");
      setZoneName("");
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();

    if (!emailVerified) {
      toast.error("Please verify your email", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (termsAndCond === false) {
      alert("Please accept the terms and conditions");
      return;
    } else if (password !== conPassword) {
      alert("Passwords Don't Match");
      return;
    } else {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const maxFileSize = 6 * 1024 * 1024; // 6 MB
      if (file && file.size > maxFileSize) {
        alert("File size exceeds the maximum limit of 6 MB.");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone_number", phone_number);
        formData.append("industry_name", industryName);
        formData.append("zone_id", zoneId);
        formData.append("industry_area", industryArea);
        formData.append("plot_number", plotNumber + ` ${zoneName}`);
        formData.append("no_of_employees", no_of_employees);
        formData.append("lessee", lessee);
        formData.append("item_manufactured", itemManufactured);
        formData.append("gstin_number", gstinNumber);
        formData.append("no_of_employees_HIM", no_of_employees_HIM);
        formData.append("is_registered", false);
        if (file) {
          formData.append("file", file);
        }
        axios
          .post(
            `${import.meta.env.VITE_SERVER}/api/industry/create`,
            formData,
            config
          )
          .then((response) => {
            if (response.status === 201) {
              toast.success("Sent for Approval to the Zonal Admin", {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
              setName("");
              setEmail("");
              setPassword("");
              setPhone("");
              setIndustryName("");
              setZoneId("");
              setIndustryArea("");
              setPlotNumber("");
              setno_of_employees("");
              setno_of_employees_HIM("");
              setLessee("");
              setItemManufactured("");
              setGstinNumber("");
              setIsRegistered(false);
              setTermsAndCond(false);
              setConPassword("");
              setFile("");
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              alert(error.response.data.message);
            } else {
              alert("Error registering user");
              console.error("Error registering user:", error);
            }
          });
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneValid(/^[6789]\d{9}$/.test(value));
  };
  const handlePassChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    );
  };
  const handleGSTchange = (e) => {
    const value = e.target.value;
    setGstinNumber(value);
    const gstinPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    setGSTValid(gstinPattern.test(value));
  };
  const handleEmailSend = async (e) => {
    e.preventDefault();
    

    if (!email) {
      toast.error("Please enter a valid email address", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    setDisableMailButton(true);
    setTimeout(() => {
      setDisableMailButton(false);
    }, 30000);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sendOtp = await axios.post(
      `${import.meta.env.VITE_SERVER}/api/industry/send-otp`,
      {
        email: email,
        config,
      }
    );
    if (sendOtp.data.success) {
      setSendEmailOtp(true);
      toast.success(sendOtp.data.message, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setSendEmailOtp(false);
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
  };
  const handleEmailVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter the otp", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

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
          email,
          config,
        }
      );
      if (sendOtp.data.success) {
        setEmailVerified(true);
        setSendEmailOtp(false);
        toast.success(sendOtp.data.message, {
          position: "top-left",
          autoClose: 3000,
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
          autoClose: 3000,
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
        autoClose: 3000,
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
    <div className="mx-auto flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xl dark:bg-neutral-900 dark:border-neutral-700 md:w-1/3">
        <div className="p-4">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Register User
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              User already registered ?<br></br>
              <Link
                className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                to="../login"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={submitHandler}>
              <div className="grid gap-y-4">
                {/* name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      id="name"
                      name="name"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>

                {/* email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="flex flex-col md:flex-row relative">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          // Reset verification if email is changed after being verified
                          if (emailVerified) {
                            setEmailVerified(false);
                            setSendEmailOtp(false);
                          }
                          handleEmailChange(e);
                        }}
                        name="email"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required
                        aria-describedby="email-error"
                        disabled={emailVerified}
                      />
                      <button
                        onClick={handleEmailSend}
                        disabled={emailVerified||disableMailButton}
                        className={`absolute right-3 top-2 rounded ${
                          emailVerified ? "text-green-500" :disableMailButton?"text-blue-400": "text-blue-500"
                        } font-semibold hover:text-blue-400 p-1`}
                      >
                        {emailVerified ? "Verified" : "Send OTP"}
                      </button>
                    </div>
                    {disableMailButton && <p className="text-red-500 mt-2">Wait 30 seconds if you want to send another OTP</p>}


                    {sendEmailOtp && (
                      <div className="flex flex-col md:flex-row relative mt-3">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          id="otp"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          name="otp"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                          required
                        />
                        <button
                          onClick={handleEmailVerify}
                          className="absolute right-3 top-2 rounded text-blue-600 font-semibold hover:text-blue-500 p-1"
                        >
                          Verify
                        </button>
                      </div>
                    )}

                    {!emailValid && email.length > 0 && (
                      <p className="text-red-600 text-xs mt-1" id="email-error">
                        Please include a valid email address.
                      </p>
                    )}
                  </div>
                </div>

                {/* phone number */}
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone_number}
                      onChange={handlePhoneChange}
                      id="phone_number"
                      name="phone_number"
                      pattern="[6789]\d{9}"
                      maxLength={10}
                      required
                      title="Phone number should be 10 digits long."
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                    {!phoneValid && phone_number.length > 0 && (
                      <p className="text-red-600 text-xs mt-1" id="phone-error">
                        Please enter a valid phone number.
                      </p>
                    )}
                  </div>
                </div>
                {/* password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      required
                      value={password}
                      onChange={handlePassChange}
                      name="password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                      title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />

                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 end-0 pe-3 flex items-center text-sm leading-5"
                    >
                      {passwordVisible ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </button>
                  </div>
                  {!passwordValid && password.length > 0 && (
                    <p className="text-red-600 text-xs mt-1">
                      Password must be at least 8 characters long and include at
                      least one uppercase letter, one lowercase letter, one
                      number, and one special character.
                    </p>
                  )}
                </div>

                {/* confirm password */}
                <div>
                  <label
                    htmlFor="conPassword"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="conPassword"
                      required
                      value={conPassword}
                      onChange={(e) => setConPassword(e.target.value)}
                      name="conPassword"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                      title="Confirm Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>

                {/* industry name */}
                <div>
                  <label
                    htmlFor="industry_name"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Industry / Shop Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      id="industry_name"
                      value={industryName}
                      onChange={(e) => setIndustryName(e.target.value)}
                      name="industry_name"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>
                {/* zone name */}
                <div>
                  <label
                    htmlFor="zone_name"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Zone Name
                  </label>
                  <div className="relative">
                    <select
                      id="zone_name"
                      value={zoneId}
                      required
                      onChange={handleZoneChange}
                      name="zone_id"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    >
                      <option value="" disabled>
                        Select value
                      </option>
                      {zoneOptions.map((option) => (
                        <option key={option.zone_name} value={option.zone_id}>
                          {option.zone_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* industry area */}
                <div>
                  <label
                    htmlFor="industry_area"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Plot Area In Square Metres
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="industry_area"
                      required
                      value={industryArea}
                      onChange={(e) => setIndustryArea(e.target.value)}
                      name="industry_area"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>

                {/* plot number */}
                <div>
                  <label
                    htmlFor="plot_number"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Plot Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="plot_number"
                      required
                      value={plotNumber}
                      onChange={(e) => setPlotNumber(e.target.value)}
                      name="plot_number"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>
                {/* no of employees */}
                <div>
                  <label
                    htmlFor="no_of_employees"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Total Number Of Employees
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="no_of_employees"
                      required
                      pattern="\d*"
                      value={no_of_employees}
                      onChange={(e) => setno_of_employees(e.target.value)}
                      name="no_of_employees"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>

                {/* Total Number of Himachali employees */}
                <div>
                  <label
                    htmlFor="no_of_employeesHIM"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Number Of Himachali Employees
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="no_of_employeesHIM"
                      required
                      value={no_of_employees_HIM}
                      onChange={(e) => setno_of_employees_HIM(e.target.value)}
                      name="no_of_employeesHIM"
                      pattern="\d*"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>

                {/* lessee */}
                <div>
                  <label
                    htmlFor="lessee"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Lessee
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lessee"
                      required
                      value={lessee}
                      onChange={(e) => setLessee(e.target.value)}
                      name="lessee"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>
                {/* item manufactured */}
                <div>
                  <label
                    htmlFor="item_manufactured"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Item Manufactured
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="item_manufactured"
                      required
                      value={itemManufactured}
                      onChange={(e) => setItemManufactured(e.target.value)}
                      name="item_manufactured"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>
                {/* gstin number */}
                <div>
                  <label
                    htmlFor="gstin_number"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    GSTIN Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="gstin_number"
                      
                      value={gstinNumber}
                      onChange={handleGSTchange}
                      name="gstin_number"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                    {!gstValid && gstinNumber.length > 0 && (
                      <p className="text-red-600 text-xs mt-1" id="gstin-error">
                        Please enter a valid GST number.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <label
                      htmlFor="doc_upload"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Upload Relevent Documents
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf, .jpg, .jpeg, .png"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* terms and conditions */}
                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="termsAndCond"
                      name="termsAndCond"
                      checked={termsAndCond}
                      onChange={(e) => setTermsAndCond(!termsAndCond)}
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-500 dark:focus:ring-offset-neutral-900 dark:bg-neutral-800 dark:border-neutral-700"
                    />
                  </div>
                  <label
                    htmlFor="termsAndCond"
                    className="text-sm text-gray-500 ms-3 dark:text-neutral-400"
                  >
                    I accept the{" "}
                    <a
                      className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal();
                      }}
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-neutral-900"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <RegistrationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default RegisterIndustry;
