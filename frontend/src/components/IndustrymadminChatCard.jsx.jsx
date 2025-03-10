import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ChatAdminAnswer from "./ChatAdminAnswer.jsx";
import ChatAdminWaitModel from "./ChatAdminWaitModel.jsx";

const IndustrymadminChatCard = () => {
  const [Name, setName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [zonalId, setzonalId] = useState("");
  const [zone, setZone] = useState("");
  const [message, setMessage] = useState("");
  const cookie = new Cookies();
  const ulRef = useRef();
  const leftHeight = useRef();
  const rightHeight = useRef();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whoResolve, setWhoResolve] = useState("");
  const [isWaitModelOpen, setIsWaitModelOpen] = useState(false);

  useEffect(() => {
    setName(cookie.get("username"));
    const token = cookie.get("token");
    const decodedToken = decodeToken(token);
    //console.log(decodedToken)
    //const zone = decodedToken.adminId
    // console.log(zone)
    // const zone = cookie.get("zone");
    // setZone(zone);
    //setUserId(decodeToken.industryId);
    getMasterAdminId();
    getZoneAdminId();
    // console.log(decodedToken)
    // if (decodedToken?.industryId) {
    //   // getZoneAdminId();
    loadAllChat();
    setEmail(cookie.get("email"));
    rightHeight.current.style.height = leftHeight.current.offsetHeight + "px";
    ulRef.current.style.height = leftHeight.current.offsetHeight - 99 + "px";
    // }
  }, []);

  const closeModal = async () => {
    setIsModalOpen(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/resolve-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: zonalId,
            whoResolve: whoResolve,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to send the request");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeWaitModal = () => {
    setIsWaitModelOpen(false);
  };
  const openWaitModal = () => {
    setIsWaitModelOpen(true);
  };
  const getMasterAdminId = async () => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/adminid`
      );
      // console.log(data.data.id)
      setAdminId(data.data.id);
    } catch (error) {
      console.log("Error" + error);
    }
  };
  const getZoneAdminId = async () => {
    try {
      const token = cookie.get("token");
      const decodedToken = decodeToken(token);
      const zonalId = decodedToken.adminId;
      setzonalId(zonalId);
      //console.log(zonalId)
      const data = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/zonename`,
        {
          params: { zonalId },
        }
      );
      // console.log(data.data.zone)
      setZone(data.data.zone);
    } catch (error) {
      console.log("Error" + error);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = cookie.get("token");
      const decodedToken = decodeToken(token);
      setzonalId(decodedToken.adminId);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let data = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/save-chat-admin`,
        {
          zonename: zone,
          adminID: adminId,
          username: Name,
          zonaladminID: decodedToken.adminId,
          message: { username: Name, message: message },
        },
        config
      );
      if (data.data.success) {
        const time = new Date().toLocaleTimeString();
        ulRef.current.innerHTML += `<li class="flex flex-col items-start pl-4 pb-2">
        <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
          <span>${message}</span>
          <span class="text-xs text-gray-500">${time}</span>
        </div>
      </li>`;
        setMessage("");
        setSubject("");
      }
    } catch (error) {
      console.log("Error" + error);
    }
  };
  const loadAllChat = async () => {
    const token = cookie.get("token");
    const decodedToken = decodeToken(token);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/zAdmin/getIndustryChat-admin`,
      {
        params: { id: decodedToken.adminId },
      },
      config
    );

    const chatData = response.data.data;
    if (chatData === null) {
      return;
    }
    if (chatData.isResolve && chatData.isSatisfied == false) {
      openWaitModal();
      setWhoResolve(chatData.whoResolve);
      return;
    } else if (chatData.isResolve && chatData.isSatisfied == true) {
      openModal();
      setWhoResolve(chatData.whoResolve);
      return;
    } else {
      const arr = chatData.message;
      ulRef.current.innerHTML = "";
      arr.map((item) => {
        if (item.message) {
          const time = new Date(item.timestamp).toLocaleTimeString();
          if (item.username === cookie.get("username")) {
            ulRef.current.innerHTML += `
              <li class="flex flex-col items-start pl-4 pb-2">
                <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
                  <span>${item.message}</span>
                  <span class="text-xs text-gray-500">${time}</span>
                </div>
              </li>`;
          } else {
            ulRef.current.innerHTML += `
              <li class="flex flex-col items-end pr-4 pb-2">
                <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
                  <span>${item.message}</span>
                  <span class="text-xs text-gray-500">${time}</span>
                </div>
              </li>`;
          }
        }
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1098}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ChatAdminAnswer
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        whoClose={whoResolve}
        userId={zonalId}
      />
      <ChatAdminWaitModel
        isModalOpen={isWaitModelOpen}
        closeModal={closeWaitModal}
        whoClose={whoResolve}
      />
      <div className="flex justify-center items-center mt-4 flex-wrap gap-4">
        <div
          ref={leftHeight}
          className="left bg-white rounded-lg shadow-md border-t-2 mt-4 w-1/3"
          style={{
            height: "32rem",
          }}
        >
          <div className="text-center p-8">
            <h1 className="text-3xl font-semibold text-blue-700">
              Complaint Details
            </h1>
          </div>
          <form
            className="space-y-6 overflow-scroll p-8 pt-0"
            style={{
              height: "26rem",
            }}
            onSubmit={handleSendMessage}
          >
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="subject"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                className="block w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setSubject(e.target.value)}
                value={subject}
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="details"
              >
                Details on the reason(s) for raising the query.
              </label>
              <textarea
                id="details"
                className="block w-full p-2 border border-gray-300 rounded-md h-40"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                required
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => history.back()}
                className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                Back to Single Window
              </button>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 text-sm rounded-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          ref={rightHeight}
          className="right flex-col border-2 border-gray-200 rounded-lg shadow-lg mt-4 w-1/2"
        >
          <div className="flex flex-col w-full">
            <h1 className="text-3xl font-semibold text-blue-700 text-center p-4 rounded-md h-1/6">
              <ReplyAllIcon fontSize="large" /> Replies
            </h1>
            {/* <hr /> */}
            <br />
            <div className="flex flex-col h-5/6">
              <ul
                ref={ulRef}
                className="rounded-md font-semibold overflow-y-scroll h-screen"
              >
                <li className="hidden pl-4 pb-2 border-2 hover:bg-blue-100 text-lg justify-start">
                  Chat 1
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndustrymadminChatCard;
