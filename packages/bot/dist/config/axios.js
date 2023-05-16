"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const ShowwcialBackend = `http://localhost:3000/api`;
const $axios = axios_1.default.create({
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
exports.default = $axios;
//# sourceMappingURL=axios.js.map