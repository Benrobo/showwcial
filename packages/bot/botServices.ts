import $axios from "./config/axios";

export default class BotServices {
  public constructor() {}

  private isEmpty(content: string) {
    if (
      typeof content === "undefined" ||
      content === null ||
      content.length === 0
    ) {
      return true;
    }
    return false;
  }

  private formatThreadContent(content: string) {}

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

  public async handleThreads(channelId: string) {
    let response = {
      success: false,
      title: null,
      url: null,
      image: null,
      content: null,
      msg: "",
    };

    if (
      channelId === "" ||
      channelId === null ||
      typeof channelId === "undefined"
    ) {
      response["msg"] = "Channel not found. Please try again later.";
      return response;
    }

    // make request to fetch posts.
    const resp = await this.request("/notifier/getThreads", { channelId });

    if (resp?.code === "--botThreads/error-fetching") {
      response["msg"] = resp.message;
      return response;
    }
    if (resp?.code === "--botThreads/channel-notfound") {
      response["msg"] = `Channel isn't authenticated. Please do so.`;
      return response;
    }
    if (resp?.code === "--botThreads/insufficient-thread") {
      response["msg"] = `${resp.message}. Please join more communities.`;
      return response;
    }
    if (resp?.code === "--botThreads/success") {
      const { title, message, linkPreviewMeta, code, id, images } = resp?.data;

      const threadUrl = `https://www.showwcase.com/thread/${id}`;
      const embeddTitle =
        typeof title !== "undefined" && title?.length > 0 ? `**${title}**` : "";
      let embeddImage = null;
      let formatedTitle = null;

      if (linkPreviewMeta !== "null") {
        if (linkPreviewMeta?.images?.length > 0) {
          embeddImage = linkPreviewMeta?.images[0];
        }
        if (typeof linkPreviewMeta?.project?.coverImage !== "undefined") {
          embeddImage = linkPreviewMeta?.project?.coverImage;
        }
      }
      if (images.length > 0) {
        embeddImage = images[0];
      }

      if (this.isEmpty(title) && !this.isEmpty(message)) {
        formatedTitle =
          message.length > 66
            ? `**${message.slice(0, 67)}**...`
            : `**${message.slice(0, 67)}**...`;
      }

      response["msg"] = null;
      response["success"] = true;
      response["url"] = threadUrl;
      response["title"] = title;
      response["content"] = `${
        embeddTitle ?? formatedTitle
      }\n${message}\n\n**Link:** ${threadUrl}`;
      response["image"] = embeddImage;

      return response;
    }
    if (this.isServerError(resp)) {
      response["msg"] = "Server error. Please try again later";
      return response;
    }

    if (this.isConnectionError(resp)) {
      response["msg"] = "Connection error. Please try again later";
      return response;
    }

    if (this.isNetworkError(resp)) {
      response["msg"] = "Connection error. Please try again later";
      return response;
    }
  }
}
