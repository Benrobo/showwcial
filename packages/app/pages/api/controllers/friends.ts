import BaseController from "./base";
import prisma from "../config/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { isEmpty } from "../../../util";

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

      const currentUserInfo = await axios
        .get(`https://cache.showwcase.com/user/${userData.username}`)
        .then((res) => res.data);

      const data = Promise.all([
        suggFollowers,
        userFollowers,
        currentUserInfo,
      ]).then((result) => {
        const [suggFollowers, userFollowers, currentUserInfo] = result;
        return {
          data: { suggFollowers, userFollowers, currentUserInfo },
          success: true,
        };
      });
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

  private async followShowwcaseUser(userId: string, showwcaseUid: any) {
    let response = { success: false };
    try {
      const userToken = await prisma.settings.findFirst({ where: { userId } });
      const resp = await axios
        .post(
          `https://cache.showwcase.com/network/followers/follow`,
          {
            userId: showwcaseUid,
          },
          {
            headers: {
              "X-API-KEY": userToken.showwcaseToken,
            },
          }
        )
        .then((res) => res.data);
      const data = resp.success;
      response["success"] = data;
      return response;
    } catch (e: any) {
      console.log(`Error occured: ${e.message}`);
      // console.log(e);
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
    const currentUserTags = data.currentUserInfo?.tags;

    const filterUser = suggFollow
      .map((user, idx, arr) => {
        if (user.id !== userFollowers[idx].id) {
          const userPic = user.profilePictureKey;
          return {
            id: user.id,
            username: user.username,
            fullname: user.displayName,
            image: userPic?.startsWith("https")
              ? userPic
              : `https://profile-assets.showwcase.com/${userPic}`,
            followers: user.totalFollowers,
            tags: user.tags,
          };
        }
      })
      .filter((user) => user.tags.length > 1);

    if (filterUser.length === 0) {
      this.error(
        res,
        "--suggestedFollowers/something-went-wrong",
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
      { suggestedFollowers: filterUser, currentUserTags }
    );
  }

  public async bulkFollowUser(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const userId = reqUser["id"];
    const payload = req.body.usersIds as string[];

    if (isEmpty(payload)) {
      this.error(res, "--userMatching/failed", "User id is missing.", 404);
      return;
    }

    if (payload.length === 0) {
      this.error(res, "--userMatching/failed", "expected valid users.", 404);
      return;
    }

    let userIdx = 0;
    let idx = payload.length;
    let counter = 0;
    let errorCount = [];

    while (idx !== 0) {
      const id = payload[userIdx];
      const isFollowed = await this.followShowwcaseUser(userId, id);
      console.log(isFollowed);
      if (!isFollowed.success) {
        counter++;
        errorCount.push({ [id]: counter });
      }
      idx--;
      userIdx += 1;
    }

    if (errorCount.length > 2) {
      this.error(
        res,
        "--userMatching/match-error",
        `Error matching ${errorCount.length} users`,
        400,
        {
          matched: payload.length - errorCount.length,
          unMatched: errorCount.length,
        }
      );
      return;
    }

    this.success(res, "--userMatching/success", "Successfully matched", 200, {
      matched: payload.length - errorCount.length,
      unMatched: errorCount.length,
    });
  }
}
