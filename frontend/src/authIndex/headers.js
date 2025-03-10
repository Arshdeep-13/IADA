import Cookies from "universal-cookie";
const cookies = new Cookies();
const token = cookies.get("token");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export default config;
