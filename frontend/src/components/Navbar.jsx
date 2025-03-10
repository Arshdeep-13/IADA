import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaGear } from "react-icons/fa6";
import SWCA_Logo from "../public/NavLogo.webp";
import Him_Logo from "../public/Him_logo.webp";

function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("token"));
  const hashedToken = CryptoJS.SHA256(token).toString();
  const slicedToken = hashedToken.substring(0, 5);
  const [showMenu, setShowMenu] = useState(false);

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
            setIsAuth(false);
            console.log("token expired");
            logout;
          } else {
            // Verify token with server
            const response = await axios.post(
              `${import.meta.env.VITE_SERVER}/api/auth/verifyToken`,
              { token }
            );
            if (response.data.valid) {
              setIsAuth(true);
            } else {
              setIsAuth(false);
              cookies.remove("token");
              logout;
            }
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setIsAuth(false);
          cookies.remove("token");
          logout;
        }
      }
    };
    verifyToken();
  }, [token]);

  const logout = () => {
    cookies.remove("token", { path: "/" });
    cookies.remove("userType", { path: "/" });
    cookies.remove("username", { path: "/" });
    cookies.remove("zone_id", { path: "/" });
    cookies.remove("admin_type", { path: "/" });
    cookies.remove("admin_id", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("zone", { path: "/" });
    cookies.remove("selected_zone", { path: "/" });
    setIsAuth(false);
    window.location.href = "/login";
  };

  return (
    <header className="relative flex flex-wrap sm:justify-start sm:flex-col w-full bg-blue-500 border-b border-gray-100 text-sm pb-2 sm:pb-0 dark:bg-gray-800 dark:border-gray-700 z-50">
      <nav
        className="w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 z-50"
        aria-label="Global"
      >
        <div className="flex items-center justify-between w-full">
          <a
            className="flex-none text-xl pt-2 pb-2 font-semibold dark:text-white"
            href="https://himachal.nic.in/en-IN/"
            aria-label="Brand"
            target="_blank"
          >
            <img
              src={Him_Logo}
              className="w-16 md:w-28 h-12 md:h-20 md:pb-2"
              alt="himachal logo"
            />
          </a>
          <div
            className={`flex flex-col transition-all duration-300 ease-in-out`}
          >
            <button
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              <img
                src={SWCA_Logo}
                className={`w-14 md:w-20 h-14 md:h-20 md:p-2 ml-12 rounded-full transition-all duration-500 ease-in-out ${
                  showMenu ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`${
          showMenu ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } flex flex-col justify-center items-center transition-all duration-500 ease-in-out w-full overflow-hidden`}
      >
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:w-1/4 mb-7 flex-wrap">
          <Link
            onClick={() => setShowMenu(!showMenu)}
            className="relative text-white text-center text-lg md:text-xl hover:text-gray-300 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-300 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-300 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
            to="/"
            aria-current="page"
          >
            Home
          </Link>

          {isAuth && cookies.get("userType") ? (
            <Link
              onClick={() => setShowMenu(!showMenu)}
              className="relative text-white text-center text-lg md:text-xl hover:text-gray-300 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-300 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-300 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              to={`/services/user/${slicedToken}`}
            >
              Services
            </Link>
          ) : isAuth && cookies.get("admin_type") === "zonal_admin" ? (
            <Link
              onClick={() => setShowMenu(!showMenu)}
              className="relative text-white text-center text-lg md:text-xl hover:text-gray-300 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-300 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-300 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              to={`services/admins/${cookies.get("zone_id")}/zonaladmin`}
            >
              Services
            </Link>
          ) : isAuth && cookies.get("admin_type") === "master_admin" ? (
            <Link
              onClick={() => setShowMenu(!showMenu)}
              className="relative text-white text-center text-lg md:text-xl hover:text-gray-300 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-300 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-300 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
              to="/services/admins/masteradmin"
            >
              Services
            </Link>
          ) : null}

          <Link
            onClick={() => setShowMenu(!showMenu)}
            className="relative text-white text-center text-lg md:text-xl hover:text-gray-300 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-300 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-300 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
            to="/about"
          >
            About us
          </Link>
          <Link
            onClick={() => setShowMenu(!showMenu)}
            className="relative text-white text-center text-lg md:text-xl hover:text-gray-300 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-300 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-300 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
            to="/contact"
          >
            Help
          </Link>
        </div>

        <div className="flex flex-col justify-between items-center gap-5 w-full mb-5">
          {isAuth ? (
            <>
              {/* If Authenticated */}
              <div className="flex gap-4 justify-center items-center">
                <Link
                  onClick={() => setShowMenu(!showMenu)}
                  to={"/settings"}
                  className="flex justify-center items-center"
                >
                  <FaGear
                    className="w-7 h-7 transition-all duration-300 ease-in-out hover:rotate-90 text-center"
                    color="white"
                  />
                </Link>
                <div className="text-xl text-white z-50 text-center bg-blue-500 transition-all duration-300 ease-in-out">
                  {"Welcome " + cookies.get("username")}
                </div>
              </div>

              <Link
                onClick={() => {
                  setShowMenu(!showMenu);
                  logout();
                }}
                className="relative border flex text-lg p-2 rounded-md items-center justify-center overflow-hidden bg-blue-500 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-600 before:duration-700 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56 hover:text-white"
              >
                <span className="relative z-10">Logout</span>
              </Link>
            </>
          ) : (
            // If Not Authenticated
            <Link
              onClick={() => setShowMenu(!showMenu)}
              to="/login"
              className="relative border flex text-lg p-2 rounded-md items-center justify-center overflow-hidden bg-blue-500 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-600 before:duration-700 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56"
            >
              <span className="relative z-10">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

