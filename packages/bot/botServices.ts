import $axios from "./config/axios";

export default class BotServices {
  public constructor() {}

  private isServerError(res: any) {
    return res?.code === "--api/server-error" ? true : false;
  }
  private isConnectionError(res: any) {
    return res?.code === "ECONNABORTED" ? true : false;
  }
  private isNetworkError(res: any) {
    return res?.message === "Network Error" ? true : false;
  }

  private async request(endpoint: string, body?: any) {
    try {
      const req = await $axios.post(endpoint, body);
      return req?.data ?? (req as any)?.response?.data;
    } catch (e: any) {
      return e.response?.data ?? { message: e.message, code: e?.code };
    }
  }

  public async authenticateBot(token: string, channelId: string) {
    let response = { success: false, message: "" };
    const res = await this.request("/notifier/authenticateBot", {
      token,
      channelId,
    });
    if (res?.code === "--botAuth/already-authenticated") {
      response["message"] = `🎉 You are already authenticated.`;
      response["success"] = true;
      return response;
    }

    if (res?.code === "--botAuth/invalid-fields") {
      response["message"] = `😢 Token or channel ID is missing.`;
      response["success"] = false;
      return response;
    }

    if (res?.code === "--botAuth/invalid-token") {
      response["message"] = `😢 Token is invalid.`;
      response["success"] = false;
      return response;
    }

    if (res?.code === "--botAuth/success") {
      response["message"] = `🎉 Successfully authenticated.`;
      response["success"] = true;
      return response;
    }

    // handle server related issues.
    if (this.isServerError(res)) {
      response["message"] = `😞 Something went wrong. Please try later.`;
      response["success"] = false;
      return response;
    }
    if (this.isNetworkError(res)) {
      response["message"] = `😞 Failed to connect to server.. Try later.`;
      response["success"] = false;
      return response;
    }
    if (this.isConnectionError(res)) {
      response["message"] = `😞 Connection Error. Please try later.`;
      response["success"] = false;
      return response;
    }
  }
}
