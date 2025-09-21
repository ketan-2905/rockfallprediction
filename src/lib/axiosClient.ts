import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://rockfallprediction-git-main-ketan-2905s-projects.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
