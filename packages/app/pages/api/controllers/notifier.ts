import { NextApiRequest, NextApiResponse } from "next";
import { NotifierVariantSchema } from "../helper/validator";
import BaseController from "./base";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

export default class NotifierController extends BaseController {
  protected notifierVariantSchema: any;
  constructor() {
    super();
    this.notifierVariantSchema = NotifierVariantSchema;
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
        isAuthenticated: false,
        disabled: false,
        discordChannelId: "",
        discordChannelName: "",
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
}
