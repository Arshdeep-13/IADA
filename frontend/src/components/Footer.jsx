import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

function Footer() {
  const cookies = new Cookies();
  const [loggedin, setLoggedin] = useState(false);

  useEffect(() => {
    if (cookies.get("token")) {
      setLoggedin(true);
    }
  }, []);

  return (
    <div>
      <footer className="mt-auto w-full max-w-[85rem] pt-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-6 mb-10">
          <div className="col-span-full hidden lg:col-span-1 lg:block">
            <div className="grid space-y-3 text-sm">
              <p
                className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100"
                aria-label="Brand"
              >
                Quick Links
              </p>
              <Link
                className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                to="/"
                aria-label="Brand"
              >
                Home
              </Link>
              {loggedin ? (
                <Link
                  className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                  to="/settings"
                  aria-label="Brand"
                >
                  Settings
                </Link>
              ) : (
                <Link
                  className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                  to="/login"
                  aria-label="Brand"
                >
                  Settings
                </Link>
              )}
              <Link
                className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                to="/contact"
                aria-label="Brand"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              About Us
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  to="/about"
                >
                  Who's Who
                </Link>
              </p>
              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  to="/termsandconditions"
                >
                  Privacy Policy
                </Link>
              </p>

              <p>
                <Link
                  className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  to="/devs"
                >
                  Developer team
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              Deputy Director 
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                Yogesh Gupta, Department of Industries, Government of Himachal
                Pradesh
              </p>
              <p>Single Window Clearance Agency</p>
              <p>Baddi - 173205</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
              Office Location
            </h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p>SWCA, Baddi Distt. Solan, Himachal Pradesh 173205</p>
              <p>PH.NO - 1795244222</p>
              <p>Email - swca.support@iadabaddi.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
