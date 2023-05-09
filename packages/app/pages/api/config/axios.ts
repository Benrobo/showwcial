import axios, { AxiosError, AxiosInstance } from "axios";
import ENV from "./env";

const $axios: AxiosInstance = axios.create({
  baseURL: "https://cache.showwcase.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // "X-API-KEY": ENV.showwcaseAPIKey,
    Authorization: `Bearer ${ENV.showwcaseToken}`,
  },
  withCredentials: true,
});

export default $axios;
