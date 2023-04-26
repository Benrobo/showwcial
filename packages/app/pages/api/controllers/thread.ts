import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { BookmarkThreadSchema, PostThreadSchema } from "../helper/validator";
import $axios from "../config/axios";
import prisma from "../config/prisma";

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
    image: string
  ) {
    try {
      let parentId = null;
      const parentThread = await $axios
        .post("/threads", {
          title,
          message: content,
          gif: image ?? "",
          videoUrl: "",
        })
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
    parentId: string
  ) {
    try {
      const parentThread = await $axios
        .post("/threads", {
          title: "",
          message: content,
          gif: image ?? "",
          videoUrl: "",
          parentId,
        })
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

    if (content.length === 1) {
      // * single thread
      await this.postParentThread(res, content[0], title, image);
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
        image
      );
      if (postedThread === null || typeof postedThread === "undefined") return;
      parentId = postedThread?.parentId;
      counter += 1;

      for (const thread of content.slice(1, content.length)) {
        const childThread = await this.addChildThread(
          res,
          thread,
          image,
          parentId
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
