// api.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://memories-be-xi.vercel.app`,
    withCredentials: true,
});

export default axiosInstance;
