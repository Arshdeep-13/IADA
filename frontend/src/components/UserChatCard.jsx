import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import { Link } from "react-router-dom";
import ChatAnswer from "./ChatAnswer";
import ChatWaitModel from "./ChatWaitModel";

const UserChatCard = () => {
  const [Name, setName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [masterAdminId, setMasterAdminId] = useState("");
  const [UserId, setUserId] = useState("");
  const [zone, setZone] = useState("");
  const cookie = new Cookies();
  const ulRef = useRef();
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [subquery, setSubquery] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const leftHeight = useRef();
  const rightHeight = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whoResolve, setWhoResolve] = useState("");
  const [isWaitModelOpen, setIsWaitModelOpen] = useState(false);
  const [caseDays, setCaseDays] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      const username = cookie.get("username");
      setName(username);

      const token = cookie.get("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const decodedToken = decodeToken(token);
      const zone = cookie.get("zone");
      setZone(zone);

      if (!decodedToken?.industryId) {
        console.error("Invalid token");
        return;
      }

      setUserId(decodedToken.industryId);
      setEmail(cookie.get("email"));

      if (leftHeight.current) {
        rightHeight.current.style.height =
          leftHeight.current.offsetHeight + "px";
        ulRef.current.style.height =
          leftHeight.current.offsetHeight - 99 + "px";
      }

      try {
        await getMasterAdminId();
        await getZoneAdminId(zone);
        await loadAllChat(decodedToken.industryId);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    initialize();
  }, []);

  const closeModal = async () => {
    setIsModalOpen(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/industry/resolve-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.get("token")}`,
          },
          body: JSON.stringify({
            userId: UserId,
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
  const getZoneAdminId = async (zone) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/industry/get-admin-id`,
        {
          params: { zone: zone },
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        }
      );
      setAdminId(res.data.id);
    } catch (error) {
      console.error("Error fetching admin ID:", error);
    }
  };
  const getMasterAdminId = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/adminid`,
        {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        }
      );
      setMasterAdminId(res.data.id);
    } catch (error) {
      console.error("Error fetching master admin ID:", error);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = cookie.get("token");
      const decodedToken = decodeToken(token);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      };

      if (!query || !subquery || !email || !subject || !message) {
        toast.error("Please fill all the fields", {
          position: "top-left",
          autoClose: 1098,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }

      if (caseDays >= 15) {
        const MasterAdminSendResponse = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/zAdmin/save-chat-admin`,
          {
            zonename: zone,
            adminID: UserId,
            username: Name,
            zonaladminID: masterAdminId,
            message: { username: Name, message: message },
          },
          config
        );
        const zonalSendResponse = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/save-chat-user`,
          {
            zonename: zone,
            zoneadminId: adminId,
            username: Name,
            userId: decodedToken.industryId,
            message: {
              username: Name,
              message: message,
              query: query,
              subquery: subquery,
              email: email,
              subject: subject,
            },
          },
          config
        );
        toast.success("Submitted Successfully", {
          position: "top-left",
          autoClose: 1098,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        const time = new Date().toLocaleTimeString();
        ulRef.current.innerHTML += `
          <li class="flex flex-col items-start pl-4 pb-2">
            <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
              <span>${message}</span>
              <span class="text-xs text-gray-500">${time}</span>
            </div>
          </li>`;
        setMessage("");
        setQuery("");
        setSubquery("");
        setEmail("");
        setSubject("");
      } else {
        const zonalSendResponse = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/save-chat-user`,
          {
            zonename: zone,
            zoneadminId: adminId,
            username: Name,
            userId: decodedToken.industryId,
            message: {
              username: Name,
              message: message,
              query: query,
              subquery: subquery,
              email: email,
              subject: subject,
            },
          },
          config
        );
        toast.success("Submitted Successfully", {
          position: "top-left",
          autoClose: 1098,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        const time = new Date().toLocaleTimeString();
        ulRef.current.innerHTML += `
          <li class="flex flex-col items-start pl-4 pb-2">
            <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
              <span>${message}</span>
              <span class="text-xs text-gray-500">${time}</span>
            </div>
          </li>`;
        setMessage("");
        setQuery("");
        setSubquery("");
        setEmail("");
        setSubject("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Authorization Added
  const loadAllChat = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/industry/getAllUserChat`,
        {
          params: { id: userId },
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        }
      );

      const chatData = response.data.data;
      setCaseDays(chatData?.caseDays);
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
        const messages = chatData.message || [];
        ulRef.current.innerHTML = "";
        messages.forEach((item) => {
          if (item.message) {
            const time = new Date(item.timestamp).toLocaleTimeString();
            const messageHtml = `
              <li class="flex flex-col items-${
                item.username === cookie.get("username") ? "start" : "end"
              } pl-4 pb-2">
                <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
                  <span>${item.message}</span>
                  <span class="text-xs text-gray-500">${time}</span>
                </div>
              </li>`;
            ulRef.current.innerHTML += messageHtml;
          }
        });
      }
    } catch (error) {
      console.error("Error loading chat:", error);
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
      <ChatAnswer
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        whoClose={whoResolve}
        userId={UserId}
      />
      <ChatWaitModel
        isModalOpen={isWaitModelOpen}
        closeModal={closeWaitModal}
        whoClose={whoResolve}
      />
      <div className="flex justify-center items-center mt-4 flex-wrap flex-col-reverse md:flex-row">
        <div
          ref={leftHeight}
          className="left bg-white p-8 rounded-lg shadow-md border-t-2 mt-4 md:w-1/2"
          style={{
            height: "32rem",
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-blue-700">
              Complaint Details
            </h1>
          </div>
          <form
            className="space-y-6 max-h-96 overflow-auto overflow-y-scroll overflow-x-hidden"
            onSubmit={handleSendMessage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="queryRelatedTo"
                >
                  Query Related To *
                </label>
                <select
                  id="queryRelatedTo"
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  required
                >
                  <option>— Select a Topic —</option>
                  <option value="Billing">Billing</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="querySubTopic"
                >
                  Query Sub Topic *
                </label>
                <select
                  id="querySubTopic"
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => setSubquery(e.target.value)}
                  value={subquery}
                  required
                >
                  <option>— Select a Sub Topic —</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Service Down">Service Down</option>
                  <option value="Account Setup">Account Setup</option>
                </select>
              </div>
            </div>
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="email"
              >
                Enter Email *
              </label>
              <input
                type="email"
                id="email"
                className="block w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                Back
              </button>
              <div className="flex space-x-2">
                <Link to="/user/upload">
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 text-sm rounded-md hover:bg-green-600 transition-transform transform hover:scale-105"
                  >
                    Upload Document
                  </button>
                </Link>
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 text-sm rounded-md hover:bg-yellow-700 transition-transform transform hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          ref={rightHeight}
          className="right flex-col border-2 border-gray-200 rounded-lg shadow-lg mt-4 w-96 md:w-1/3"
          style={{
            height: "32rem",
          }}
        >
          <div className="flex flex-col w-full">
            <h2 className="text-3xl font-semibold text-blue-700 text-center p-4 rounded-md h-1/6">
              <ReplyAllIcon fontSize="large" /> Replies
            </h2>
            {/* <hr /> */}
            <br />
            <div className="flex flex-col w-full h-5/6">
              <ul
                ref={ulRef}
                className="rounded-md font-semibold overflow-y-scroll"
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

export default UserChatCard;
