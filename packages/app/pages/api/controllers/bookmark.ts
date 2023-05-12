import { NextApiRequest, NextApiResponse } from "next";
import $axios from "../config/axios";
import { BookmarkDataSchema } from "../helper/validator";
import BaseController from "./base";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import bcryptjs from "bcryptjs";
import { isEmpty } from "../../../util";

const pwd = "1234";
const hash = bcryptjs.hashSync(pwd, 10);
console.log({ hash });

export default class BookmarkController extends BaseController {
  protected bookmarkDataSchema;
  constructor() {
    super();
    this.bookmarkDataSchema = BookmarkDataSchema;
  }

  public async isDataIdValid(id: number, type: string) {
    try {
      const validType = type === "thread" ? "threads" : "projects";
      const threadInfo = await $axios
        .get(`/${validType}/${id}`)
        .then((r) => r.data);
      return { valid: true, info: threadInfo };
    } catch (e: any) {
      console.error(`Invalid ${type} id ${id}`);
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

  public async bookmarkData(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const payload = req.body;
    const { error, value } = this.bookmarkDataSchema.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      return this.error(res, "--bookmarkData/invalid-fields", msg, 400);
    }

    const validType = ["thread", "show"];
    const { id: dataId, type } = payload;

    if (!validType.includes(type)) {
      return this.error(
        res,
        "--bookmarkData/invalid-fields",
        `Invalid type given.`,
        400
      );
    }

    const { valid, info } = await this.isDataIdValid(dataId, type);
    if (!valid) {
      return this.error(
        res,
        "--bookmarkData/invalid-fields",
        `${type} is invalid.. check ${type} ID.`,
        400
      );
    }

    // check if threadId exists
    let availableBookmarks;

    if (type === "thread") {
      availableBookmarks = await prisma.bookMarks.findMany({
        where: { threadId: dataId.toString(), userId: reqUser["id"] },
      });
    }
    if (type === "show") {
      availableBookmarks = await prisma.bookMarks.findMany({
        where: { showId: dataId.toString(), userId: reqUser["id"] },
      });
    }

    if (availableBookmarks?.length > 0) {
      return this.error(
        res,
        "--bookmarkData/bookmark-exists",
        `bookmark with this id ${dataId} already exists..`,
        400,
        availableBookmarks
      );
    }

    const { message, title, code, images, slug } = info;
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

    const threadLinkPreview = info?.linkPreviewMeta;
    const dataUrl =
      type === "show"
        ? `https://www.showwcase.com/show/${dataId}/${slug}`
        : `https://www.showwcase.com/thread/${dataId}`;
    const bookmarkId = uuidv4();

    // check if user has configured their api key.
    const userTokens = await prisma.settings.findFirst({
      where: { userId: reqUser?.id },
    });
    const showwcaseApiToken = userTokens?.showwcaseToken;

    if (isEmpty(showwcaseApiToken)) {
      this.error(
        res,
        "--bookmarkData/token-missing",
        `Please integrate showwcase api key, to continue.`,
        400
      );
      return;
    }

    // try saving thread first on showwcase
    await $axios
      .post(
        "/bookmarks",
        { threadId: dataId, projectId: "" },
        {
          headers: {
            "X-API-KEY": showwcaseApiToken,
          },
        }
      )
      .then(async (r) => {
        if (r.data?.success) {
          const bookmarkData = await prisma.bookMarks.create({
            data: {
              id: bookmarkId,
              userId: reqUser?.id,
              threadId: type === "thread" ? dataId.toString() : "",
              showId: type === "show" ? dataId.toString() : "",
              title: title ?? "",
              type,
              category: info?.category ?? "",
              coverImage: info?.coverImage ?? "",
              displayName,
              emoji: activity?.emoji ?? "🔥",
              headline,
              content: message ?? "",
              link: dataUrl,
              readingStats: info?.readingStats?.text ?? "",
              username,
              userImage: userProfilePicture,
              images: JSON.stringify(images ?? []),
              code: code ?? "",
              linkPreviewMeta: JSON.stringify({
                title: threadLinkPreview?.title ?? "",
                description: threadLinkPreview?.description ?? "",
                url: threadLinkPreview?.url ?? "",
                images:
                  type === "thread"
                    ? threadLinkPreview?.images?.length > 0
                      ? images[0]
                      : ""
                    : "",
                favicon: "",
              }),
            },
          });

          this.success(
            res,
            "--bookmarkData/successfull",
            `${type} successfully bookmarked`,
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
