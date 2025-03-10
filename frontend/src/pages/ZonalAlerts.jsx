import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const ZonalAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const zone_id = cookies.get("zone_id");
  const [noAlerts, setNoAlerts] = useState(false);

    useEffect(() => {
      const fetchAlerts = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_SERVER}/api/news/getAdminAlerts/${zone_id.toString()}`,
            {}
          );
          setAlerts(response.data.adminAlerts.alerts);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError("No alerts found!");
            setNoAlerts(true);
          } else setError(error.response);
        } finally {
          setLoading(false);
        }
      };

      fetchAlerts();
    }, [zone_id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
        Zonal Alerts
      </h2>
      <div className="overflow-y-auto max-h-[calc(100vh-150px)]"> {/* Adjust 150px based on navbar height */}
        {alerts.length > 0 && noAlerts === false ? (
          <ul>
            {[...alerts].reverse().map((alert, index) => (
              <li
                key={index}
                className={`mb-2 p-4 border-b border-gray-200 rounded-xl ${
                  alert.isRead ? "bg-gray-100" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{alert.title}</h3>
                  <span
                    className={`text-sm font-semibold ${
                      alert.isRead ? "text-transparent" : "text-green-400"
                    }`}
                  >
                    {" "}
                    {alert.isRead ? "" : "New"}
                  </span>
                </div>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: alert.content }}></p>
                <small className="text-gray-500">
                  {new Date(alert.date).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 rounded-2xl shadow-inner">
            <svg
              className="h-12 w-12 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5 5a.5.5 0 000 1v8a.5.5 0 001 1h4a.5.5 0 001-1v-8a.5.5 0 00-1-1H5zM12 2.5a.5.5 0 000 1v15a.5.5 0 001 1h4a.5.5 0 001-1v-15a.5.5 0 00-1-1h-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-gray-700 mt-4 text-center">
              You have no new alerts at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ZonalAlerts;
