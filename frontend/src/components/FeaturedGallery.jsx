import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import bannerImg from "../assets/webpImages/banner-image.webp";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";

function FeaturedGallery({ isAuth, zone_id }) {
  const [zoneOptions, setZoneOptions] = useState([]);
  const [zoneId, setZoneId] = useState("123");
  const [zoneName, setZoneName] = useState("Baddi");
  const cookie = new Cookies();
  const admin_type = cookie.get("admin_type");
  const [data, setData] = useState([]);
  const [active, setActive] = useState("");
  const [fade, setFade] = useState(false);
  const [userData, setUserData] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookie.get("zone")) setZoneName(cookie.get("zone"));
  });

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

  useEffect(() => {
    async function approvedImages() {
      setLoading(true);
      setActive("");
      let res;
      if (admin_type === "master_admin") {
        res = await fetch(
          `${import.meta.env.VITE_SERVER}/api/industry/get-approved-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookie.get("token")}`,
            },
            body: JSON.stringify({
              zone_id: zoneId,
            }),
          }
        );
        res = await res.json();
      } else {
        res = await fetch(
          `${import.meta.env.VITE_SERVER}/api/industry/get-approved-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${cookie.get("token")}`,
            },
            body: JSON.stringify({
              zone_id: zone_id,
            }),
          }
        );
        res = await res.json();
      }

      setLoading(false);
      setUserData(res);
      // Convert ArrayBuffer data to image URLs
      const imagesWithUrls = res.map((image) => {
        const { data, contentType } = image;
        const blob = new Blob([new Uint8Array(data.data)], {
          type: contentType,
        });

        return {
          ...image,
          imgelink: URL.createObjectURL(blob),
        };
      });

      setData(imagesWithUrls);
      if (imagesWithUrls.length > 0) {
        setActive(imagesWithUrls[0].imgelink);
      }
      while (imagesWithUrls.length < 5) {
        imagesWithUrls.push({ imgelink: bannerImg });
      }
    }
    approvedImages();
  }, [zoneId]);
  const handleImageClick = (imgelink) => {
    setFade(true);
    setTimeout(() => {
      setActive(imgelink);
      setFade(false);
    }, 500);
  };
  const override = {
    display: "block",
    margin: "0 auto",
  };

  return (
    <div className="grid gap-4 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-7 mx-auto">
      {isAuth && admin_type === "master_admin" && (
        <div className="w-36">
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
      )}
      <div className="flex items-center justify-center mb-6">
        {admin_type === "master_admin" && (
          <h1
            className="text-4xl md:text-5xl font-extrabold text-gray-800 
                     relative inline-block text-center 
                     transition-all duration-500 ease-in-out 
                     hover:scale-105 
                     bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-900 
                     text-transparent bg-clip-text p-2"
          >
            Image Gallery of the Industrial Area
          </h1>
        )}
        {admin_type !== "master_admin" && (
          <h1
            className="text-4xl md:text-5xl font-extrabold text-gray-800 
             relative inline-block text-center 
             transition-all duration-500 ease-in-out 
             hover:scale-105 
             bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-900 
             text-transparent bg-clip-text p-2"
          >
            {" "}
            Image Gallery of {zoneName} Industrial Area
          </h1>
        )}
      </div>
      <div>
        {loading ? (
          <RingLoader
            cssOverride={override}
            loading={loading}
            color="#2980b9"
            size={150}
          />
        ) : (
          <img
            className={`h-auto w-full max-w-full rounded-lg object-contain object-center md:h-[400px] transition-opacity duration-100 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
            src={active == "" ? bannerImg : active}
            alt="Industry Promotion Image"
            loading="lazy"
          />
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.length > 0 &&
          data.map(({ imgelink }, index) => (
            <div
              className="flex flex-col items-center justify-between p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md"
              key={index}
            >
              {userData.length > 0 &&
              userData[0].images &&
              userData[0].images[index] ? (
                <span className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2 text-green-500"
                  >
                    {userData[0].images[index].isAccepted === true ? (
                      <path d="M9 12l2.5 2.5 6-6" />
                    ) : (
                      <circle cx="12" cy="12" r="10" />
                    )}
                  </svg>
                  <span className="text-gray-700">
                    {userData[0].images[index].isAccepted
                      ? "Accepted"
                      : "Pending"}
                  </span>
                </span>
              ) : null}
              {imgelink ? (
                <img
                  onClick={() => handleImageClick(imgelink)}
                  src={imgelink}
                  className="h-20 max-w-full object-cover object-center rounded-lg cursor-pointer hover:opacity-75"
                  alt="Industry Promotion Image"
                  loading="lazy"
                />
              ) : (
                <>
                  <span className="flex items-center mt-2 text-gray-500 text-sm">
                    Not Uploaded
                  </span>
                  <img
                    src={bannerImg}
                    className="h-20 max-w-full object-cover object-center rounded-lg cursor-pointer hover:opacity-75"
                    alt="Industry Promotion Image"
                    loading="lazy"
                  />
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default FeaturedGallery;
