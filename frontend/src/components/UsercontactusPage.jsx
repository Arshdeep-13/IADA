import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import CryptoJS from "crypto-js";

const Usercontactus = () => {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [UserId, setUserId] = useState("");
  const [zone, setZone] = useState("");
  const cookie = new Cookies();
  const messageRef = useRef();
  const ulRef = useRef();
  const [message, setMessage] = useState("");
  const [industryDetail, setIndustryDetail] = useState({});
  const [masterAdminDetails, setMasterAdminDetails] = useState([]);
  const token = cookie.get("token");
  const hashedToken = CryptoJS.SHA256(token).toString();
  const slicedToken = hashedToken.substring(0, 5);

  useEffect(() => {
    setName(cookie.get("username"));
    const token = cookie.get("token");
    const decodedToken = decodeToken(token);
    const zone = cookie.get("zone");
    setZone(zone);
    setUserId(decodeToken.industryId);

    // console.log(decodedToken)
    if (decodedToken?.industryId) {
      getZoneAdminId();
      getMasterAdmin();
      // loadAllChat();
    }
  }, []);

  const getZoneAdminId = async () => {
    const zone = cookie.get("zone");
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/industry/get-admin-id`,
      {
        params: { zone: zone },
        headers: {
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      }
    );
    // console.log(res.data.data);
    setIndustryDetail(res.data.data);
    setAdminId(res.data.id);
  };
  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = cookie.get("token");
  //     const decodedToken = decodeToken(token);
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     let data = await axios.post(
  //       `${import.meta.env.VITE_SERVER}/api/industry/save-chat-user`,
  //       {
  //         zonename: zone,
  //         zoneadminId: adminId,
  //         username: Name,
  //         userId: decodedToken.industryId,
  //         message: { username: Name, message:message },
  //       },
  //       config
  //     );
  //     if (data.data.success) {
  //       ulRef.current.innerHTML += `<li class="flex pl-4 pb-2 border-2 hover:bg-blue-100 text-lg justify-start">${message}</li>`;
  //       setMessage("");
  //     }
  //   } catch (error) {
  //     console.log("Error" + error);
  //   }
  // };
  // const loadAllChat = async () => {
  //   const token = cookie.get("token");
  //   const decodedToken = decodeToken(token);
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   let data = await axios.get(
  //     `${import.meta.env.VITE_SERVER}/api/industry/getAllUserChat`,
  //     {
  //       params: { id: decodedToken.industryId },
  //     },
  //     config
  //   );
  //   if (data.data.data) {
  //     const arr = data.data.data.message;
  //     ulRef.current.innerHTML = "";
  //     arr.map((item) => {
  //       if (item.message) {
  //         const time = new Date(item.timestamp).toLocaleTimeString();
  //         if (item.username === cookie.get("username")) {
  //           ulRef.current.innerHTML += `
  //             <li class="flex flex-col items-start pl-4 pb-2">
  //               <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
  //                 <span>${item.message}</span>
  //                 <span class="text-xs text-gray-500">${time}</span>
  //               </div>
  //             </li>`;
  //         } else {
  //           ulRef.current.innerHTML += `
  //             <li class="flex flex-col items-end pr-4 pb-2">
  //               <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
  //                 <span>${item.message}</span>
  //                 <span class="text-xs text-gray-500">${time}</span>
  //               </div>
  //             </li>`;
  //         }
  //       }
  //     });
  //   }
  // };
  const getMasterAdmin = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/industry/getMasterAdminDetails`,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      }
    );
    setMasterAdminDetails(res.data);
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto h-auto mt-4 border-t-2">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-700">
            Helpdesk – Himachal Pradesh
          </h1>
        </div>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="material-icons mr-3 text-blue-500 bg-gray-200 rounded-full p-1">
              <PhoneIcon />
            </span>
            <a
              href={`tel:+91${industryDetail.phone_number}`}
              className="text-gray-800 text-lg"
            >
              {industryDetail.phone_number}
            </a>
          </div>
          <div className="flex items-center mb-4">
            <span className="material-icons mr-3 text-blue-500 bg-gray-200 rounded-full p-1">
              <MailOutlineIcon />
            </span>
            <Link
              to={`mailto:${industryDetail.admin_email}`}
              className="text-gray-800 text-lg"
            >
              {industryDetail.admin_email}
            </Link>
          </div>
          <div className="flex items-center mb-4">
            <span className="material-icons mr-3 text-blue-500 bg-gray-200 rounded-full p-1">
              <BusinessIcon />
            </span>
            <address className="text-gray-800 text-lg">{zone}</address>
          </div>
        </div>
        <div className="text-center mb-8">
          <Link
            to={`/services/user/${slicedToken}/chat`}
            className="text-blue-500 hover:underline text-lg"
          >
            REGISTER YOUR COMPLAINT/GRIEVANCE
          </Link>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-700">
            Nodal Officer
          </h2>
        </div>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="material-icons text-blue-500 bg-gray-200 rounded-full p-1">
              <PersonIcon />
            </span>
            {masterAdminDetails.map((obj, idx) => (
              <span className="text-gray-800 text-lg ml-3" key={idx}>
                {obj.admin_name}
              </span>
            ))}
          </div>
          <div className="flex items-center mb-4">
            <span className="material-icons text-blue-500 bg-gray-200 rounded-full p-1">
              <MailOutlineIcon />
            </span>
            {masterAdminDetails.map((obj, idx) => (
              <a
                key={idx}
                href={`mailto:${obj.admin_email}`}
                className="text-gray-800 text-lg ml-3"
              >
                {obj.admin_email}
              </a>
            ))}
          </div>
          <div className="flex items-center mb-4">
            <span className="material-icons text-blue-500 bg-gray-200 rounded-full p-1">
              <PhoneIcon />
            </span>
            {masterAdminDetails.map((obj, idx) => (
              <a
                key={idx}
                href={`mailto:${obj.phone_number}`}
                className="text-gray-800 text-lg ml-3"
              >
                {obj.phone_number}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Usercontactus;
