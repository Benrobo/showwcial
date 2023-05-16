const axios = require("axios");

const ShowwcialBackend = `http://localhost:3000/api`;

const $axios = axios.create({
  baseURL: ShowwcialBackend,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // "X-API-KEY": ENV.showwcaseAPIKey,
    // Authorization: `Bearer ${ENV.showwcaseToken}`,
  },
  withCredentials: true,
});

module.exports = $axios;
