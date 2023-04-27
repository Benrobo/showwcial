import { NextApiRequest, NextApiResponse } from "next";
import $axios from "../config/axios";
import { BookmarkThreadSchema } from "../helper/validator";
import BaseController from "./base";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import bcryptjs from "bcryptjs";

const pwd = "1234";
const hash = bcryptjs.hashSync(pwd, 10);
console.log({ hash });

export default class BookmarkController extends BaseController {
  protected bookmarkThreadSchema;
  constructor() {
    super();
    this.bookmarkThreadSchema = BookmarkThreadSchema;
  }

  public async isThreadIdValid(id: number) {
    try {
      const threadInfo = await $axios.get(`/threads/${id}`).then((r) => r.data);
      return { valid: true, info: threadInfo };
    } catch (e: any) {
      console.error(`Invalid thread id ${id}`);
      return { valid: false, info: null };
    }
  }

  public async getValidUserProfilePic(uId: number) {
    try {
      const url = `https://cache.showwcase.com/user/${uId}?fields=username,profilePictureKey,profilePictureUrl`;
      const res = await axios.get(url).then((r) => r.data);
      return { success: true, data: res };
    } catch (e: any) {
      return { success: false, data: null };
    }
  }

  public async bookmarkThread(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const payload = req.body;
    const { error, value } = this.bookmarkThreadSchema.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      return this.error(res, "--bookmarkThread/invalid-fields", msg, 400);
    }

    const { threadId } = payload;
    const { valid, info } = await this.isThreadIdValid(threadId);
    if (!valid) {
      return this.error(
        res,
        "--bookmarkThread/invalid-thread",
        `Thread is invalid.. check thread ID.`,
        400
      );
    }

    // check if threadId exists
    const availableThread = await prisma.bookMarks.findMany({
      where: { threadId: threadId.toString() },
    });

    if (availableThread?.length > 0) {
      return this.error(
        res,
        "--bookmarkThread/thread-exists",
        `Thread with this id ${threadId} already exists..`,
        400,
        availableThread
      );
    }

    const { message, title, code, id, images } = info;
    const {
      displayName,
      activity,
      id: showwcaseUId,
      username,
      headline,
    } = info.user;
    let userProfilePicture = null;
    const { data, success } = await this.getValidUserProfilePic(showwcaseUId);

    if (!success) userProfilePicture = info.user?.profilePictureKey;

    userProfilePicture = data?.profilePictureUrl;

    const {
      title: lpTitle,
      description: lpDesc,
      url: lpUrl,
      images: lpImages,
    } = info.linkPreviewMeta;
    const threadUrl = `https://www.showwcase.com/thread/${threadId}`;
    const bookmarkId = uuidv4();

    // try saving thread first on showwcase
    await $axios
      .post("/bookmarks", { threadId, projectId: "" })
      .then(async (r) => {
        if (r.data?.success) {
          const bookmarkData = await prisma.bookMarks.create({
            data: {
              id: bookmarkId,
              userId: reqUser?.id,
              threadId: threadId.toString(),
              title: title ?? "",
              displayName,
              emoji: activity?.emoji ?? "🔥",
              headline,
              content: message,
              link: threadUrl,
              username,
              userImage: userProfilePicture,
              images: JSON.stringify(images),
              code,
              linkPreviewMeta: JSON.stringify({
                title: lpTitle ?? "",
                description: lpDesc ?? "",
                url: lpUrl ?? "",
                images: typeof lpImages !== "undefined" ? lpImages[0] : "",
                favicon: "",
              }),
            },
          });

          this.success(
            res,
            "--bookmarkThread/successfull",
            "Thread successfully bookmarked",
            200,
            bookmarkData
          );
        }
      });
  }

  public async fetchAllBookmarks(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const uId = reqUser["id"];

    const bookmarkData = await prisma.bookMarks.findMany({
      where: { userId: uId },
    });

    const final = bookmarkData.map((data) => {
      if (data.linkPreviewMeta && data.linkPreviewMeta !== null) {
        data["linkPreviewMeta"] = JSON.parse(data?.linkPreviewMeta as string);
      }
      return data;
    });

    this.success(
      res,
      "--bookmarks/all-bookmarks",
      "all bookmarks fetched..",
      200,
      final
    );
  }
}
