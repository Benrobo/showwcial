import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { PostThreadSchema } from "../helper/validator";
import $axios from "../config/axios";
import prisma from "../config/prisma";
import { isEmpty } from "../../../util";

export default class ThreadController extends BaseController {
  protected postThreadSchema;
  constructor() {
    super();
    this.postThreadSchema = PostThreadSchema;
  }

  public async postParentThread(
    res: NextApiResponse,
    content: string,
    title: string,
    image: string,
    showwcaseApiToken: string
  ) {
    try {
      let parentId = null;
      const parentThread = await $axios
        .post(
          "/threads",
          {
            title,
            message: content,
            gif: image ?? "",
            videoUrl: "",
          },
          {
            headers: {
              "X-API-KEY": showwcaseApiToken,
            },
          }
        )
        .then((r) => r.data);
      parentId = parentThread?.id;
      return { parentId };
    } catch (e: any) {
      console.log(`Error posting thread: ${e}`);
      this.error(
        res,
        "--createThread/failed-creating-thread",
        `Failed to post thread ${e.message}`,
        500
      );
      return null;
    }
  }

  public async addChildThread(
    res: NextApiResponse,
    content: string,
    image: string,
    parentId: string,
    showwcaseApiToken: string
  ) {
    try {
      const parentThread = await $axios
        .post(
          "/threads",
          {
            title: "",
            message: content,
            gif: image ?? "",
            videoUrl: "",
            parentId,
          },
          {
            headers: {
              "X-API-KEY": showwcaseApiToken,
            },
          }
        )
        .then((r) => r.data);
      return true;
    } catch (e: any) {
      console.log(`Error posting thread: ${e}`);
      this.error(
        res,
        "--createThread/failed-replying-thread",
        `Failed to add child thread ${e.message}`,
        500
      );
      return false;
    }
  }

  public async postThread(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const payload = req.body;
    const { error, value } = this.postThreadSchema.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      return this.error(res, "--createThread/invalid-fields", msg, 400);
    }

    const { content, title, image } = payload;
    const userTokens = await prisma.settings.findFirst({
      where: { userId: reqUser?.id },
    });
    const showwcaseApiToken = userTokens?.showwcaseToken;

    if (isEmpty(showwcaseApiToken)) {
      this.error(
        res,
        "--createThread/token-missing",
        `Please integrate showwcase api key, to continue.`,
        400
      );
      return;
    }

    if (content.length === 1) {
      // * single thread
      await this.postParentThread(
        res,
        content[0],
        title,
        image,
        showwcaseApiToken
      );
      this.success(
        res,
        "--createThread/success",
        `Thread created successfully.`,
        200,
        content
      );
    }
    // * multiple threads
    if (content.length > 1) {
      let parentId = null;
      let counter = 0;

      const postedThread = await this.postParentThread(
        res,
        content[0],
        title,
        image,
        showwcaseApiToken
      );
      if (postedThread === null || typeof postedThread === "undefined") return;
      parentId = postedThread?.parentId;
      counter += 1;

      for (const thread of content.slice(1, content.length)) {
        const childThread = await this.addChildThread(
          res,
          thread,
          image,
          parentId,
          showwcaseApiToken
        );
        if (childThread) counter += 1;
      }

      if (counter === content.length) {
        this.success(
          res,
          "--createThread/success",
          `Thread created successfully.`,
          200,
          content
        );
        return;
      }
    }
  }
}
