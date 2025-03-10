import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import UserToAdminModel from "./UserToAdminModel";
import AdminDashControl from "../components/ZonalAdminDashControl";

const AdminChatCard = () => {
  const [Name, setName] = useState("");
  const [industryUserName, setIndustryUserName] = useState("");
  const [industryUserId, setIndustryUserId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [message, setMessage] = useState("");
  const [zone, setZone] = useState("");
  const [chatNames, setChatNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const cookie = new Cookies();
  const messageRef = useRef();
  const ulRef = useRef();
  const userRef = useRef();
  const clearChatRef = useRef();
  const [clearChat, setClearChat] = useState(false);
  const [isResolve, setIsResolve] = useState(null);
  const [isModelOpen, setisModelOpen] = useState(false);
  // creating the object for mapping chat.id with the unreadCount
  const [unreadCounts, setUnreadCounts] = useState({});
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    // console.log(cookie.get("zone"))
    setName(cookie.get("username"));
    const token = cookie.get("token");
    const decodedToken = decodeToken(token);
    setAdminId(decodedToken.adminId);
    loadAllChatNames();
  }, []);
  useEffect(() => {
    const newUnreadCounts = {};
    chatNames.forEach((chat) => {
      newUnreadCounts[chat._id] = calculateUnreadCount(chat);
    });
    setUnreadCounts(newUnreadCounts);
  }, [chatNames]);
  useEffect(() => {
    if (showControlPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showControlPanel]);

  const openModel = () => {
    setisModelOpen(true);
  };
  const closeModel = () => {
    setisModelOpen(false);
  };
  const loadAllChatNames = async () => {
    try {
      const token = cookie.get("token");
      const decodedToken = decodeToken(token);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      };
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/industry/getAllZoneChat`,
        { params: { id: decodedToken.adminId }, ...config }
      );

      const chatData = response.data.data;

      if (chatData) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        };
        const userRes = chatData.map((chat) =>
          axios.get(
            `${import.meta.env.VITE_SERVER}/api/industry/getUserDetails`,
            { params: { userId: chat.userId }, ...config }
          )
        );

        const userDetails = await Promise.all(userRes);
        const AllDataMerge = chatData.map((chat, index) => ({
          ...chat,
          userDetails: userDetails[index].data.data,
        }));
        setOriginalData(AllDataMerge);
        setChatNames(AllDataMerge);
      }
    } catch (error) {
      //console.log("Error fetching chat names:", error);
    }
  };
  const makeUnRead = async (chat) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      };
      const data = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/unread-chat`,
        chat,
        config
      );
      loadAllChatNames();
    } catch (error) {
      // console.log("Error" + error);
    }
  };
  const handleParticularChat = (chat, e) => {
    // sending the request
    makeUnRead(chat);
    clearChatRef.current = e.target.parentNode;
    setZone(chat.zonename);
    setIndustryUserId(chat.userId);
    setIsResolve(chat.isResolve);
    setIndustryUserName(chat.username);

    const isSatisfied = chat.isSatisfied;
    const isResolve = chat.isResolve;
    if (isResolve && isSatisfied === false) {
      openModel();
    }

    const arr = chat.message;
    ulRef.current.innerHTML = "";
    arr.forEach((item) => {
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
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const token = cookie.get("token");
      const zone = cookie.get("zone");
      const decodedToken = decodeToken(token);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      };
      let response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/save-chat-user`,
        {
          zonename: zone,
          zoneadminId: adminId,
          username: Name,
          userId: industryUserId,
          message: {
            username: Name,
            message: message,
            query: "",
            subquery: "",
            email: "",
            subject: "",
          },
        },
        config
      );
      if (response.data.success) {
        const time = new Date().toLocaleTimeString();
        ulRef.current.innerHTML += `<li class="flex flex-col items-start pl-4 pb-2">
        <div class="bg-blue-100 border-2 border-blue-100 rounded-lg text-lg p-2">
          <span>${message}</span>
          <span class="text-xs text-gray-500">${time}</span>
        </div>
      </li>`;
        setMessage("");
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchQuery(searchValue);
    if (searchValue === "") {
      setChatNames(originalData);
    } else {
      const filteredNames = originalData.filter((chat) =>
        chat.username.toLowerCase().includes(searchValue)
      );
      setChatNames(filteredNames);
    }
  };
  const handleResolveChat = async (e) => {
    e.preventDefault();
    try {
      const alertData = window.confirm("Do you want to close the chat ?");

      if (alertData) {
        const token = cookie.get("token");
        const zone = cookie.get("zone");
        const decodedToken = decodeToken(token);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        };
        let response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/resolve-chat`,
          {
            zoneadminId: adminId,
            userId: industryUserId,
            whoResolve: Name,
          },
          config
        );
        if (response.data.success) {
          toast.success("Updated Successfully");
          handleParticularChat(response.data.chat, e);

          if (alertData) {
            if (clearChat == false) {
              // make the display of all childs to none except the first child
              for (let i = 1; i < liData.children.length; i++) {
                liData.children[i].style.display = "none";
              }
              // make the display of ul child to none
              for (let i = 0; i < ulRef.current.children.length; i++) {
                ulRef.current.children[i].style.display = "none";
              }

              const para = document.createElement("p");
              para.innerHTML = "Chat Resolved";
              liData.appendChild(para);
              setClearChat(true);
              e.target.innerHTML = "Reopen the Chat";
            } else {
              liData.removeChild(liData.lastChild);
              for (let i = 1; i < liData.children.length; i++) {
                liData.children[i].style.display = "block";
              }
              for (let i = 0; i < ulRef.current.children.length; i++) {
                ulRef.current.children[i].style.display = "flex";
              }
              setClearChat(false);
              e.target.innerHTML = "Resolve Chat";
            }
          }
        }
      }
    } catch (error) {
      console.log("error to get data" + error);
    }
  };
  const calculateUnreadCount = (chat) => {
    let unreadCount = 0;
    for (let i = chat.message.length - 1; i >= 0; i--) {
      if (chat.message[i].isRead) {
        break;
      } else {
        unreadCount++;
      }
    }
    return unreadCount;
  };
  const handleControlClick = () => {
    setShowControlPanel(!showControlPanel);
  };
  const handleClickOutside = (e) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target) &&
      e.target.id !== "toggle-button"
    ) {
      setShowControlPanel(false);
    }
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
        theme="colored"
      />
      <div className="flex p-4 mb-10">
        <button
          ref={sideBarBtnRef}
          onClick={handleControlClick}
          id="toggle-button"
          className="p-2 bg-blue-600 text-white rounded-full sticky left-4 z-50 top-28 flex items-center justify-center transition-transform transform hover:scale-110"
        >
          {showControlPanel ? (
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
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ) : (
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
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          )}
          Control Panel
        </button>
        <div
          className={`border-b-2 absolute top-0 left-0 h-full pt-24 md:pt-28 overflow-x-hidden bg-white z-30 transition-transform duration-500 ease-in-out ${
            showControlPanel
              ? "translate-x-0 opacity-100 w-64"
              : "-translate-x-full opacity-0 w-0"
          }`}
          ref={sidebarRef}
        >
          <AdminDashControl />
        </div>
      </div>
      <UserToAdminModel
        isModalOpen={isModelOpen}
        closeModal={closeModel}
        whoClose={industryUserName}
      />
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-0 mt-4">
        <div className="flex flex-col border-2 border-gray-200 rounded-lg shadow-lg w-full md:w-1/3 h-96">
          <div className="flex flex-col w-full h-full">
            <h1 className="text-xl font-bold bg-blue-400 text-white p-4 rounded-md">
              Chats
            </h1>
            <input
              type="text"
              placeholder="Search Zone"
              onChange={handleSearch}
              value={searchQuery}
              className="p-2 border-b-2 border-blue-400 focus:outline-none"
            />
            <ul
              className="pt-1 rounded-md font-semibold h-screen overflow-y-scroll"
              ref={userRef}
            >
              {chatNames.map((chat, index) => (
                <li
                  key={index}
                  className="flex flex-col pl-4 pb-2 border-2 hover:bg-blue-100 justify-start"
                  onClick={(e) => {
                    handleParticularChat(chat, e);
                  }}
                >
                  <div className="flex justify-around">
                    <span className="text-lg mr-20 mt-3">{chat.username}</span>
                    {unreadCounts[chat._id] > 0 ? (
                      <button
                        type="button"
                        className="btn btn-warning"
                        style={{ width: "25%", height: "10px", margin: "3px" }}
                      >
                        new{" "}
                        <span
                          className="badge badge-warning"
                          style={{
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                        >
                          {" "}
                          {unreadCounts[chat._id]}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{
                          width: "25%",
                          height: "10px",
                          margin: "3px",
                          color: "white",
                        }}
                      >
                        new
                        <span
                          className="badge badge-success"
                          style={{
                            color: "black",
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                        >
                          0
                        </span>
                      </button>
                    )}
                  </div>
                  {clearChat ? (
                    <p>Chat Resolved</p>
                  ) : (
                    <>
                      <p
                        key={`${chat.username}-${index}`}
                        className="flex pl-1 pb-2 hover:bg-blue-100 text-sm justify-start ml-5"
                        onClick={() => handleParticularChat(chat)}
                      >
                        message :{" "}
                        {chat.message[chat.message.length - 1].message}
                      </p>

                      <p
                        key={index + 1}
                        className="flex pl-1 pb-2 hover:bg-blue-100 text-sm justify-start ml-5"
                      >
                        Query : {chat.message[chat.message.length - 1].query}
                      </p>
                      <p
                        key={index + 2}
                        className="flex pl-1 pb-2 hover:bg-blue-100 text-sm justify-start ml-5"
                      >
                        Sub-Query :{" "}
                        {chat.message[chat.message.length - 1].subquery}
                      </p>
                      <p
                        key={index + 3}
                        className="flex pl-1 pb-2 hover:bg-blue-100 text-sm justify-start ml-5"
                      >
                        email :{" "}
                        {chat.userDetails
                          ? chat.userDetails.email
                          : "No email given"}
                      </p>
                      <p
                        key={index + 4}
                        className="flex pl-1 pb-2 hover:bg-blue-100 text-sm justify-start ml-5"
                        onClick={() => handleParticularChat(chat)}
                      >
                        zone : {chat.zonename}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col border-2 border-gray-200 rounded-lg shadow-lg md:w-1/2 h-96"
          ref={messageRef}
        >
          <div className="flex flex-col w-full h-full">
            <h1 className="text-xl font-bold bg-blue-400 text-white p-4 rounded-md h-1/6">
              {Name}
            </h1>
            <div className="flex flex-col w-full h-5/6">
              <ul
                ref={ulRef}
                className="rounded-md font-semibold overflow-y-scroll h-screen"
              >
                <li className="hidden pl-4 pb-2 border-2 hover:bg-blue-100 text-lg justify-start">
                  Chat 1
                </li>
              </ul>

              {!isResolve ? (
                <form
                  onSubmit={handleSendMessage}
                  className="flex justify-center items-center bg-red-100"
                >
                  <button
                    className="p-1 bg-blue-500 hover:bg-blue-400 text-white"
                    style={{
                      width: "160px",
                      height: "41px",
                    }}
                    onClick={(e) => handleResolveChat(e)}
                    type="button"
                  >
                    Resolve Chat
                  </button>

                  <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border-l-0 border-b-0 border-r-0 border-t-1 border-gray-300"
                  />
                  <input
                    type="submit"
                    className="p-2 bg-blue-500 hover:bg-blue-400 text-white"
                  />
                </form>
              ) : (
                <button
                  className="p-1 bg-blue-500 hover:bg-blue-400 text-white"
                  // style={{
                  //   width: "450px",
                  //   height: "80px",
                  // }}
                  onClick={(e) => handleResolveChat(e)}
                  type="button"
                >
                  Re-Open Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChatCard;
