import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { isEmpty } from "../../../util";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";

export default class SettingsController extends BaseController {
  public constructor() {
    super();
  }

  public async addExternalCredentials(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const payload = req.body;
    const uId = req["user"]?.id;

    if (isEmpty(payload["token"])) {
      this.error(
        res,
        "--settings/invalid-field",
        "Expected valid token but got none.",
        400
      );
      return;
    }

    if (isEmpty(payload["type"])) {
      this.error(
        res,
        "--settings/invalid-field",
        "Expected valid type but got none",
        400
      );
      return;
    }

    const validTypes = ["notion", "showwcase"];

    if (!validTypes.includes(payload["type"])) {
      this.error(
        res,
        "--settings/invalid-field",
        "Invalid type provided. expected notion or showwcase type.",
        400
      );
      return;
    }

    const { token, type } = payload;
    let availableTokens = await prisma.settings.findFirst({
      where: { userId: uId },
    });

    if (availableTokens === null) {
      if (type === "notion") {
        await prisma.settings.create({
          data: {
            id: uuidv4(),
            notionIntegrationToken: token,
            showwcaseToken: "",
            userId: uId,
          },
        });
      }
      if (type === "showwcase") {
        await prisma.settings.create({
          data: {
            id: uuidv4(),
            notionIntegrationToken: "",
            showwcaseToken: token,
            userId: uId,
          },
        });
      }

      this.success(
        res,
        "--settings/token-added",
        "Notion integration added successfully",
        200
      );
      return;
    }

    if (availableTokens !== null) {
      // update previous token
      if (type === "showwcase") {
        await prisma.settings.update({
          where: { id: availableTokens?.id },
          data: { showwcaseToken: token },
        });
      }
      if (type === "notion") {
        await prisma.settings.update({
          where: { id: availableTokens?.id },
          data: { notionIntegrationToken: token },
        });
      }
      this.success(
        res,
        "--settings/token-updated",
        `${
          type === "showwcase" ? "Showwcase token" : "Notion integration"
        } updated successfully`,
        200
      );
      return;
    }
  }

  public async getToken(req: NextApiRequest, res: NextApiResponse) {
    const uId = req["user"]?.id;
    const token = await prisma.settings.findFirst({
      where: { userId: uId },
    });

    this.success(
      res,
      "--settings/token-fetched",
      `Token fetched successfully"`,
      200,
      token
    );
  }
}
