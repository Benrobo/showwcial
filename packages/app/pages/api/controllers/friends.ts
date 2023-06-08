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
    const userData = await prisma.users.findFirst({ where: { id: userId } });
    try {
      const suggFollowers = await axios
        .get(`https://cache.showwcase.com/users/suggested_followers`, {
          headers: {
            "X-API-KEY": userToken.showwcaseToken,
          },
        })
        .then((res) => res.data);
      const userFollowers = await axios
        .get(
          `https://cache.showwcase.com/network/followers?username=${userData.username}`,
          {
            headers: {
              "X-API-KEY": userToken.showwcaseToken,
            },
          }
        )
        .then((res) => res.data);

      const data = Promise.all([suggFollowers, userFollowers]).then(
        (result) => {
          const [suggFollowers, userFollowers] = result;
          return { data: { suggFollowers, userFollowers }, success: true };
        }
      );
      return data;
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
    const suggFollow = data.suggFollowers;
    const userFollowers = data.userFollowers;

    const filterUser = suggFollow.map((user, idx, arr) => {
      if (user.id !== userFollowers[idx].id) {
        return {
          id: user.id,
          username: user.username,
          fullname: user.displayName,
          image: user.profilePictureKey,
          followers: user.totalFollowers,
          tags: user.tags,
        };
      }
    });

    if (filterUser.length === 0) {
      this.error(
        res,
        "----suggestedFollowers/something-went-wrong",
        "No users for now",
        404
      );
      return;
    }

    this.success(
      res,
      "--suggestedFollowers/success",
      "suggested followers fetched.",
      200,
      filterUser
    );
  }
}
