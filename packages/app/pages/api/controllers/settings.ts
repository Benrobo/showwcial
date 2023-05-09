import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { isEmpty } from "../../../util";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";

export default class SettingsController extends BaseController {
  public constructor() {
    super();
  }

  public async addNotionToken(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;
    const uId = req["user"]?.id;
    if (isEmpty(payload?.token)) {
      this.error(
        res,
        "--settings/invalid-field",
        "Expected valid token but got none.",
        400
      );
      return;
    }

    const { token } = payload;

    // check if token exists
    const tokenExists = await prisma.settings.findFirst({
      where: { userId: uId },
    });

    if (tokenExists !== null) {
      // update previous token
      await prisma.settings.update({
        where: { id: tokenExists?.id },
        data: { notionIntegrationToken: token },
      });
      this.success(
        res,
        "--settings/token-updated",
        "Notion integration updated successfully",
        200
      );
      return;
    }

    await prisma.settings.create({
      data: {
        id: uuidv4(),
        notionIntegrationToken: token,
        userId: uId,
      },
    });

    this.success(
      res,
      "--settings/token-added",
      "Notion integration added successfully",
      200
    );
  }

  public async getToken(req: NextApiRequest, res: NextApiResponse) {
    const uId = req["user"]?.id;
    const token = await prisma.settings.findFirst({
      where: { userId: uId },
    });

    this.success(
      res,
      "--settings/token-fetched",
      "Token fetched successfully",
      200,
      token ?? []
    );
  }
}
