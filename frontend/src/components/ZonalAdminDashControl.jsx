import React from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

function ZonalAdminDashControl() {
  const cookie = new Cookies();

  const registeredRender = () => {
    if (localStorage.getItem("registeredRender") != "true") {
      localStorage.setItem("registeredRender", "true");
      localStorage.setItem("unregisteredRender", "false");
    }
  };
  const unregisteredRender = () => {
    if (localStorage.getItem("unregisteredRender") != "true") {
      localStorage.setItem("unregisteredRender", "true");
      localStorage.setItem("registeredRender", "false");
    }
  };

  return (
    <aside className="flex flex-col w-64 px-5 py-8 bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
              Registration
            </label>

            <Link
              onClick={registeredRender}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get("zone_id")}/zonaladmin`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">
                Registered Industries
              </span>
            </Link>

            <Link
              onClick={unregisteredRender}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get("zone_id")}/zonaladmin`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">
                Unregistered Industries
              </span>
            </Link>
          </div>

          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
              content
            </label>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get(
                "zone_id"
              )}/zonaladmin/upload-document`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Upload Documnets</span>
            </Link>
            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get(
                "zone_id"
              )}/zonaladmin/upload_bills`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">
                Upload Water Bill
              </span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get(
                "zone_id"
              )}/zonaladmin/showbills`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <span className="mx-2 text-sm font-medium">
                Check all Water Bills
              </span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get(
                "zone_id"
              )}/zonaladmin/paymentHistory`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <span className="mx-2 text-sm font-medium">
                Check Payment History
              </span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get(
                "zone_id"
              )}/zonaladmin/checkdocument`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Check Documents</span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get(
                "zone_id"
              )}/zonaladmin/gallery`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Industry gallery</span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={`/services/admins/${cookie.get("zone_id")}/zonaladmin/chat`}
            >
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="15.000000pt"
                height="15.000000pt"
                viewBox="0 0 50.000000 50.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  strokeWidth="none"
                >
                  <path
                    d="M170 468 c-58 -29 -118 -118 -80 -118 6 0 10 7 10 17 0 26 76 91 115
99 60 11 106 -4 147 -47 21 -22 38 -46 38 -54 0 -8 5 -15 10 -15 17 0 11 25
-13 61 -27 41 -98 79 -147 79 -20 0 -56 -10 -80 -22z"
                  />
                  <path
                    d="M55 317 c-3 -7 -5 -54 -3 -103 3 -88 3 -89 28 -89 l25 0 0 100 c0 96
-1 100 -23 103 -12 2 -24 -3 -27 -11z"
                  />
                  <path
                    d="M395 317 c-3 -7 -5 -54 -3 -103 3 -88 3 -89 28 -89 l25 0 0 100 c0
96 -1 100 -23 103 -12 2 -24 -3 -27 -11z"
                  />
                  <path
                    d="M10 271 c-14 -28 -12 -74 5 -97 13 -17 14 -13 15 49 0 37 -2 67 -5
67 -2 0 -9 -9 -15 -19z"
                  />
                  <path
                    d="M471 225 c0 -64 1 -68 14 -51 8 11 15 34 15 51 0 17 -7 40 -15 51
-13 17 -14 13 -14 -51z"
                  />
                  <path
                    d="M396 85 c-3 -9 -19 -18 -36 -21 -31 -7 -42 -24 -14 -24 30 0 73 31
74 53 0 13 -18 7 -24 -8z"
                  />
                  <path
                    d="M204 66 c-13 -34 4 -47 53 -44 44 3 48 5 48 28 0 23 -4 25 -48 28
-35 2 -49 -1 -53 -12z"
                  />
                </g>
              </svg>

              <span className="mx-2 text-sm font-medium">
                Industry Helpline
              </span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to="/services/admins/:zone_id/zonaladmin/chat-admin"
            >
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="15.000000pt"
                height="15.000000pt"
                viewBox="0 0 50.000000 50.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  strokeWidth="none"
                >
                  <path
                    d="M170 468 c-58 -29 -118 -118 -80 -118 6 0 10 7 10 17 0 26 76 91 115
99 60 11 106 -4 147 -47 21 -22 38 -46 38 -54 0 -8 5 -15 10 -15 17 0 11 25
-13 61 -27 41 -98 79 -147 79 -20 0 -56 -10 -80 -22z"
                  />
                  <path
                    d="M55 317 c-3 -7 -5 -54 -3 -103 3 -88 3 -89 28 -89 l25 0 0 100 c0 96
-1 100 -23 103 -12 2 -24 -3 -27 -11z"
                  />
                  <path
                    d="M395 317 c-3 -7 -5 -54 -3 -103 3 -88 3 -89 28 -89 l25 0 0 100 c0
96 -1 100 -23 103 -12 2 -24 -3 -27 -11z"
                  />
                  <path
                    d="M10 271 c-14 -28 -12 -74 5 -97 13 -17 14 -13 15 49 0 37 -2 67 -5
67 -2 0 -9 -9 -15 -19z"
                  />
                  <path
                    d="M471 225 c0 -64 1 -68 14 -51 8 11 15 34 15 51 0 17 -7 40 -15 51
-13 17 -14 13 -14 -51z"
                  />
                  <path
                    d="M396 85 c-3 -9 -19 -18 -36 -21 -31 -7 -42 -24 -14 -24 30 0 73 31
74 53 0 13 -18 7 -24 -8z"
                  />
                  <path
                    d="M204 66 c-13 -34 4 -47 53 -44 44 3 48 5 48 28 0 23 -4 25 -48 28
-35 2 -49 -1 -53 -12z"
                  />
                </g>
              </svg>

              <span className="mx-2 text-sm font-medium">
                Connect with Admin
              </span>
            </Link>
          </div>

          <div className="space-y-3 ">
            <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
              Customization
            </label>

            <Link
              className="bg-slate-300 flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200  dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">
                Pending Bills & Fines
              </span>
            </Link>

            <Link
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              to={"/settings"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Account Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default ZonalAdminDashControl;
