import { NextApiRequest, NextApiResponse } from "next";
import { NotifierVariantSchema } from "../helper/validator";
import BaseController from "./base";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import { isEmpty } from "../../../util";
import memcache from "memory-cache";
import axios from "axios";

//! Remember to fix duplicates threads been fetched.

export default class NotifierController extends BaseController {
  protected notifierVariantSchema: any;
  constructor() {
    super();
    this.notifierVariantSchema = NotifierVariantSchema;
  }

  public async getShowwcaseThreads() {
    let response = { data: null, success: false };
    try {
      const res = await axios.get(
        `https://cache.showwcase.com/feeds/discover?limit=100`
      );
      response["data"] = res?.data ?? (res as any)?.response?.data;
      response["success"] = true;
      return response;
    } catch (e: any) {
      response["data"] = e.response?.data ?? {
        message: e.message,
        code: e?.code,
      };
      response["success"] = false;
      return response;
    }
  }

  public async createVariant(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const uId = reqUser["id"];
    const payload = req.body;
    const { error, value } = this.notifierVariantSchema.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      return this.error(res, "--createVariant/invalid-fields", msg, 400);
    }

    if (!["thread", "show", "jobs"].includes(payload?.type)) {
      return this.error(
        res,
        "--createVariant/invalid-type",
        `variant type of ${payload?.type} is invalid.`,
        400
      );
    }

    const { tags, communities, name, icon, type } = payload;
    const token = uuidv4().replaceAll("-", "").slice(0, 35);

    // check if name isn't taking.
    const nameExists = await prisma.botNotifier.findMany({ where: { name } });

    if (nameExists.length > 0) {
      return this.error(
        res,
        "--createVariant/name-exists",
        `Name already exists.`,
        400
      );
    }

    await prisma.botNotifier.create({
      data: {
        id: uuidv4(),
        userId: uId,
        name,
        type,
        icon,
        tags: JSON.stringify(tags),
        communities: JSON.stringify(communities),
        token,
        disabled: false,
        notifAuthChannels: JSON.stringify([]),
      },
    });

    this.success(res, "--createVariant/success", "success", 200, null);
  }

  public async allVariants(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const uId = reqUser["id"];

    const allVariants = await prisma.botNotifier.findMany({
      where: { userId: uId },
    });

    const formatedData = allVariants.map((d) => {
      if (d.communities || d.tags) {
        d["communities"] = JSON.parse(d.communities as any);
        d["tags"] = JSON.parse(d.tags as any);
      }
      return d;
    });

    this.success(
      res,
      "--allVariants/success",
      "success",
      200,
      formatedData as any
    );
  }

  public async deleteVariant(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const uId = reqUser["id"];
    const variantId = req.query["id"] as string;

    if (isEmpty(variantId)) {
      return this.error(
        res,
        "--deleteVariant/invalid-ID",
        `failed to delete.. variant not found.`,
        400
      );
    }

    const variantBelongToUser = await prisma.botNotifier.findFirst({
      where: {
        id: variantId,
        userId: uId,
      },
    });

    if (variantBelongToUser === null) {
      return this.error(
        res,
        "--deleteVariant/unauthorised",
        `permission denied.`,
        403
      );
    }

    await prisma.botNotifier.delete({ where: { id: variantId } });

    this.success(res, "--deleteVariant/success", "success", 200);
  }

  public async authenticateBot(req: NextApiRequest, res: NextApiResponse) {
    const { token, channelId } = req.body;

    if (isEmpty(token) || isEmpty(channelId)) {
      return this.error(
        res,
        "--botAuth/invalid-fields",
        "Token or channel ID is missing.",
        400
      );
    }

    const tokenExists = await prisma.botNotifier.findFirst({
      where: { token },
      include: { user: true },
    });

    if (tokenExists === null) {
      return this.error(
        res,
        "--botAuth/invalid-token",
        "token doesn't exists.",
        400
      );
    }

    const authChannel =
      JSON.parse(tokenExists?.notifAuthChannels as string) ?? [];

    const prevChannel = authChannel as string[];

    if (tokenExists?.isAuthenticated && prevChannel.includes(channelId)) {
      return this.error(
        res,
        "--botAuth/already-authenticated",
        "token already authenticated.",
        400
      );
    }

    if (!prevChannel.includes(channelId)) {
      prevChannel.push(channelId);
    }

    const userId = tokenExists?.userId;
    const userInfo = await prisma.users.findFirst({
      where: { id: userId },
      include: { accounts: true },
    });

    await prisma.botNotifier.update({
      where: { id: tokenExists.id },
      data: {
        isAuthenticated: true,
        notifAuthChannels: JSON.stringify(prevChannel),
      },
    });

    const refToken = userInfo?.accounts?.refresh_token;

    const botCacheData = {
      refToken,
      channelId,
      notifierToken: token,
    };

    // 99999999 set expiry time to future.
    memcache.put(channelId, JSON.stringify(botCacheData), 999999999);

    this.success(
      res,
      "--botAuth/success",
      "bot successfully authenticated.",
      200,
      botCacheData
    );
  }

  public async fetchThreads(req: NextApiRequest, res: NextApiResponse) {
    const { channelId } = req.body;
    if (isEmpty(channelId)) {
      return this.error(
        res,
        "--botThreads/invalid-fields",
        "Channel ID is missing.",
        400
      );
    }

    // check if channelId exists in db.
    const notifierData = await prisma.botNotifier.findMany();
    const filteredChannels = notifierData.map((ch) => {
      const channelIds = JSON.parse(ch.notifAuthChannels as string);
      if (channelIds.includes(channelId)) return ch;
      return null;
    });
    const availableChannel =
      filteredChannels[0] === null ? [] : filteredChannels;

    if (availableChannel.length === 0) {
      return this.error(
        res,
        "--botThreads/channel-notfound",
        "Failed to fetch.. channel ID isn't found in our record.",
        400
      );
    }

    // const tags = JSON.parse(notifierData?.tags);
    const communities = JSON.parse(availableChannel[0]?.communities);
    const PostsWithoutCommunities = [];
    const PostsWithCommunities = [];

    const allThreads = await this.getShowwcaseThreads();

    if (!allThreads?.success) {
      return this.error(
        res,
        "--botThreads/error-fetching",
        "Error occured while fetching threads.",
        400
      );
    }

    for (let i = 0; i < allThreads?.data.length; i++) {
      const d = allThreads?.data[i];
      if (communities.includes(d?.community?.slug)) {
        PostsWithoutCommunities.push(d);
      }
      if (typeof d?.community !== "undefined") {
        PostsWithCommunities.push(d);
      }
    }

    const combinedPosts = PostsWithoutCommunities.concat(PostsWithCommunities);
    const selectedPosts =
      combinedPosts[Math.floor(Math.random() * combinedPosts.length)];

    if (Object.entries(selectedPosts).length === 0) {
      return this.error(
        res,
        "--botThreads/insufficient-thread",
        "Insufficient Threads.",
        400
      );
    }

    // check if selected posts hasn't been posted before.
    const prevPost = await prisma.botPrevPosts.findMany({
      where: { postId: `${selectedPosts?.id}`, type: "thread" },
    });

    if (prevPost.length === 0) {
      // now store selected post which would be used for discord message.
      await prisma.botPrevPosts.create({
        data: {
          id: uuidv4(),
          type: "thread",
          postId: selectedPosts?.id.toString(),
        },
      });

      // send selected posts to discord.
      this.success(
        res,
        "--botThreads/success",
        "posts fetched successfully",
        200,
        selectedPosts
      );
      return;
    }
    // if previous post is found in db, get all posts id from prevPosts table and fiter ones that isn't present in combinePosts
    const allPrevPosts = await prisma.botPrevPosts.findMany();

    // now store selected post which would be used for discord message.
    await prisma.botPrevPosts.create({
      data: {
        id: uuidv4(),
        type: "thread",
        postId: selectedPosts?.id.toString(),
      },
    });

    // send selected posts to discord.
    this.success(
      res,
      "--botThreads/success",
      "posts fetched successfully",
      200,
      selectedPosts
    );
  }

  public async fetchShows(req: NextApiRequest, res: NextApiResponse) {}
}
