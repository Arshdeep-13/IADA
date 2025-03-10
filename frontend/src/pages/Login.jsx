import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJS from "crypto-js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("industry");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [userOtp, setUserOtp] = useState("");
  const [passowrdVerified, setPasswordVerified] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [otpUserData, setOtpUserData] = useState(null);
  const [underProcess, setUnderProcess] = useState(false);
  const [user, setUser] = useState({});
  const [showLogin, setShowLogin] = useState(true);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [timerExpired, setTimerExpired] = useState(false);
  const recaptcha = useRef();
  const cookies = new Cookies();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    if (showForgotPassword) {
      setEmail("");
      setShowOTPInput(false);
      setUserOtp("");
      setNewPassword("");
      setTimer(600);
      setTimerExpired(false);
    }
  }, [showForgotPassword]);
  useEffect(() => {
    if (!showOTPInput) return;
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setTimerExpired(true);
          setShowOTPInput(false); // Close OTP Input Modal
          setShowForgotPassword(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTPInput]);

  useEffect(() => {
    if (!showOTPInput) {
      setTimer(600);
      setTimerExpired(false);
    }
  }, [showOTPInput]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleForgotPassword = async () => {
    setUnderProcess(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/forgotpassword`,
        {
          email,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setShowForgotPassword(false);
        setShowOTPInput(true);
        setUnderProcess(false);
      } else {
        toast.error(res.data.message);
        setUnderProcess(false);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      setUnderProcess(false);
    }
  };

  const handleVerifyOTP = async () => {
    setUnderProcess(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/forgotpassword/verifyotp`,
        { email, userOtp, newPassword }
      );
      if (res.status === 200) {
        toast.success("OTP Verified Successfully");
        toast.success("Password reset successful");
        // Redirect to login page or handle as needed
        navigate("/login");
        setShowOTPInput(false);
        setUnderProcess(false);
      } else {
        toast.error(res.data.message);
        setUnderProcess(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      setUnderProcess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUnderProcess(true);
    const captchaValue = recaptcha.current.getValue();

    if (!captchaValue) {
      alert("Please verify the reCAPTCHA!");
      setUnderProcess(false);
    } else {
      try {
        let res;
        const secretKey = `${import.meta.env.VITE_SECRET}`;
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          secretKey
        ).toString();
        if (loginType === "industry") {
          res = await axios.post(
            `${import.meta.env.VITE_SERVER}/api/industry/login`,
            {
              email,
              password: encryptedPassword,
              rememberMe,
              captchaValue,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (res.status === 200) {
            res = res.data;
            setOtpUserData(res);
            toast.success("Password verified, please verify OTP", {
              position: "top-left",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setOtpRequired(true);
            setUnderProcess(false);
            setPasswordVerified(true);
            return;
          }
        } else {
          res = await axios.post(
            `${import.meta.env.VITE_SERVER}/api/zAdmin/login`,
            {
              admin_email: email,
              password: encryptedPassword,
              rememberMe,
              captchaValue,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (res.status === 200) {
            handleSuccessfulLogin(res.data, "admin");
          }
        }
      } catch (err) {
        toast.error(err?.response?.data.message, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        recaptcha.current.reset();
        setUnderProcess(false);
      }
    }
  };

  const verifyLoginOtp = async () => {
    if (!loginOtp) {
      toast.error("Please enter Otp", {
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
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER}/api/industry/verify-otp`,
      {
        email: otpUserData.email,
        otp: loginOtp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      handleSuccessfulLogin(response.data, "industry");
    } else {
      toast.error("Wrong OTP", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleSuccessfulLogin = async (res, type) => {
    if (type === "industry") {
      const zoneName = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/industry/getZoneName`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            zone_id: res.industry.zone_id,
          },
        }
      );
      document.cookie = `zone=${zoneName.data.zone_name}`;
      document.cookie = `userType=${res.userType}`;
      document.cookie = `username=${res.industry.name}`;
      document.cookie = `token=${res.token}`;
      document.cookie = `email=${res.industry.email}`;
      document.cookie = `zone_id=${res.industry.zone_id}`;
      setUser(res.industry);
    } else {
      console.log(res);
      document.cookie = `zone=${res.zoneName}`;
      document.cookie = `zone_id=${res.admin.zone_id}`;
      document.cookie = `username=${res.admin.admin_name}`;
      document.cookie = `token=${res.token}`;
      document.cookie = `admin_type=${res.admin.admin_type}`;
      document.cookie = `admin_id=${res.admin.admin_id}`;
      document.cookie = `email=${res.admin.admin_email}`;
    }
    toast.success("Login Successfull!", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setUnderProcess(false);
    navigate("/");
    window.location.reload();
  };

  const handlePassChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordValid(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    );
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* login form*/}
      {showLogin && (
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 dark:border-neutral-700 w-96 mx-auto">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Login
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Don't have an account yet?
                <br />
                <Link
                  className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                  to="../industryregister"
                >
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      {loginType === "industry" ? " Email" : "Admin Email"}
                    </label>
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="email-error"
                    />
                  </div>

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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required
                        aria-describedby="password-error"
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
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="industryLogin"
                      name="loginType"
                      value="industry"
                      checked={loginType === "industry"}
                      onChange={() => setLoginType("industry")}
                      className="mr-2"
                    />
                    <label
                      htmlFor="industryLogin"
                      className="text-sm text-gray-600 dark:text-neutral-400"
                    >
                      Industry
                    </label>
                    <input
                      type="radio"
                      id="zoneAdminLogin"
                      name="loginType"
                      value="zoneAdmin"
                      checked={loginType === "zoneAdmin"}
                      onChange={() => setLoginType("zoneAdmin")}
                      className="ml-6 mr-2"
                    />
                    <label
                      htmlFor="zoneAdminLogin"
                      className="text-sm text-gray-600 dark:text-neutral-400"
                    >
                      Administrator
                    </label>
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-gray-600 dark:text-neutral-400"
                    >
                      Remember Me
                    </label>
                  </div>

                  <ReCAPTCHA
                    ref={recaptcha}
                    sitekey="6Lf2jycqAAAAAEUBjb_xFmAsEEQkz6NFbAOA64wL"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={underProcess || passowrdVerified}
                  >
                    Sign in
                  </button>

                  {otpRequired && (
                    <div className="flex flex-col">
                      <p className="text-xs">
                        Enter the OTP sent to number ending with{" "}
                        {otpUserData.phone_number?.slice(
                          otpUserData.phone_number.length - 4,
                          otpUserData.phone_number.length
                        )}
                      </p>
                      <input
                        type="text"
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value)}
                        placeholder="Enter Otp"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      ></input>
                      <button
                        type="button"
                        className="w-full py-3 mt-4 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => {
                          verifyLoginOtp();
                        }}
                      >
                        SUBMIT
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    className="w-full mt-3 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-200 text-gray-600 hover:bg-gray-300"
                    onClick={() => {
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none  backdrop-blur-sm">
          <div className="relative w-auto max-w-sm mx-auto my-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl dark:bg-neutral-900 dark:border-neutral-700">
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Forgot Password?
                </h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3">
                  Please enter your email address to receive a password reset
                  link.
                </p>
                <input
                  type="email"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex justify-end mt-5">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleForgotPassword}
                    disabled={underProcess}
                  >
                    Send OTP
                  </button>
                  <button
                    className="ml-3 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification & new password  Modal */}
      {showOTPInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="border border-gray-200 bg-white rounded-xl shadow-2xl dark:bg-neutral-900 dark:border-neutral-700 w-max h-max">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h2 className="block text-2xl font-bold text-gray-800 dark:text-white">
                  OTP Verification
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                  Please enter the OTP sent to your email.
                </p>
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Your OTP expires after {formatTime(timer)}
                </p>
              </div>

              <div className="mt-5">
                <form>
                  <div className="grid gap-y-4">
                    <div>
                      <input
                        type="text"
                        id="otp"
                        value={userOtp}
                        onChange={(e) => setUserOtp(e.target.value)}
                        name="otp"
                        className="mx-auto my-auto py-3 px-4 block w-max border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required
                      />
                    </div>
                    <div className="p- sm:p-7">
                      <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                          Reset Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                          Please enter your new password.
                        </p>
                      </div>
                      <div className="mt-5">
                        <form>
                          <div className="relative">
                            <input
                              type={passwordVisible ? "text" : "password"}
                              id="newPassword"
                              value={newPassword}
                              onChange={handlePassChange}
                              name="newPassword"
                              pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}"
                              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                              className="py-3 px-4 block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                              className="absolute inset-y-0 end-0 pe-3 flex items-center text-sm leading-5"
                            >
                              {passwordVisible ? (
                                <FontAwesomeIcon icon={faEyeSlash} />
                              ) : (
                                <FontAwesomeIcon icon={faEye} />
                              )}
                            </button>
                          </div>

                          <div className="mt-1 flex flex-row">
                            {!passwordValid && newPassword.length > 0 && (
                              <p className="text-red-600 text-xs w-full max-w-xs">
                                Password must be at least 8 characters long and
                                include at least one uppercase letter, one
                                lowercase letter, one number, and one special
                                character.
                              </p>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => {
                        handleVerifyOTP();
                      }}
                      disabled={underProcess}
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-slate-500 text-white hover:bg-slate-600 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => {
                        setShowOTPInput(false), setUserOtp("");
                      }}
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
