import BaseController from "./base";
import prisma from "../config/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default class FriendController extends BaseController {
  constructor() {
    super();
  }

  private async fetchSuggestedFolowers(userId: string) {
    let response = { data: null, success: false };
    const userToken = await prisma.settings.findFirst({
      where: { userId: userId },
    });
    try {
      const res = await axios.get(
        `https://cache.showwcase.com/users/suggested_followers`,
        {
          headers: {
            "X-API-KEY": userToken.showwcaseToken,
          },
        }
      );
      response["data"] = res?.data ?? (res as any)?.response?.data;
      response["success"] = true;
      return response;
    } catch (e: any) {
      console.log(e);
      response["data"] = e.response?.data ?? {
        message: e.message,
        code: e?.code,
      };
      response["success"] = false;
      return response;
    }
  }

  public async getSuggestedFollowers(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const reqUser = req["user"];

    const userId = reqUser["id"];
    const followers = await this.fetchSuggestedFolowers(userId);

    if (!followers.success) {
      this.error(
        res,
        "--suggestedFollowers/something-went-wrong",
        "Something went wrong fetching suggested followers.",
        400
      );
      return;
    }

    const data = followers.data;

    console.log(data);
  }
}
