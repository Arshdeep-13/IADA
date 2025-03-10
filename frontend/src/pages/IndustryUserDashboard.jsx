import NewsCard from "../components/NewsCard";
import CardGroup from "../components/CardGroup";
import FabButton from "../components/FABbutton";
import { FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import axios from "axios";

function IndustryUserDashboard() {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("token"));
  const decodedToken = token ? jwtDecode(token) : {};
  const industry_id = decodedToken.industryId;
  const nav = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAlertsSummary = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER
          }/api/news/${industry_id}/alerts-summary`
        );
        setUnreadCount(response.data.numUnreadAlerts);
      } catch (error) {
        console.error(
          "Error fetching alerts summary:",
          error.response.data.message
        );
      }
    };

    fetchAlertsSummary();
  }, [industry_id]);
  const handleFabClick = () => {
    nav(`/industry-alerts/${industry_id}`);
  };
  return (
    <div>
      <FabButton
        onClick={handleFabClick}
        icon={<FaComment />}
        badgeCount={unreadCount}
      />

      <CardGroup />

      <NewsCard />
    </div>
  );
}

export default IndustryUserDashboard;
