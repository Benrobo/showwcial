import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { Client } from "@notionhq/client";
import { isEmpty } from "../../../util";
import prisma from "../config/prisma";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { v4 as uuidv4 } from "uuid";

function notion(token: string) {
  const notion = new Client({
    auth: token,
  });
  return notion;
}

export default class PageBuilderController extends BaseController {
  constructor() {
    super();
  }

  public async verifyNotionPage(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;
    const uId = req["user"]?.id;

    if (isEmpty(payload?.id)) {
      this.error(
        res,
        "--pageBuilder/invalid-notion-page",
        "Notion page id is missing.",
        400
      );
      return;
    }

    const userNotionToken = await prisma.settings.findFirst({
      where: { userId: uId },
    });

    let pageContent = <null | GetDatabaseResponse>null;

    try {
      const result = await notion(
        userNotionToken?.notionIntegrationToken
      ).databases.retrieve({ database_id: payload?.id });

      pageContent = result;
    } catch (e: any) {
      if (e?.code === "unauthorized") {
        this.error(
          res,
          "--pageBuilder/invalid-notion-token",
          "Token is invalid, please update notion token",
          500
        );
        return;
      }
      this.error(
        res,
        "--pageBuilder/server-error",
        `Someting went wrong: ${e.message}`,
        500
      );
      return;
    }

    const databaseId = pageContent.id;

    // check if database id exists
    const notionDBIdExists = await prisma.site.findMany({
      where: { notionDatabaseId: databaseId },
    });

    if (notionDBIdExists.length > 0) {
      this.error(
        res,
        "--pageBuilder/notionPage-in-use",
        `Notion page is already in use.`,
        400,
        pageContent?.properties
      );
      return;
    }

    // check if it contains necessary information.
    // cols: Github Url, Description, Tags, Live Url, Image, Name
    const pageProperties = pageContent?.properties;
    const propKeys = Object.keys(pageProperties);
    const validCols = [
      "Github Url",
      "Description",
      "Tags",
      "Live Url",
      "Image",
      "Name",
    ];
    const notFoundCols = [];

    for (let i = 0; i < validCols.length; i++) {
      const keys = validCols[i];
      if (!propKeys.includes(keys)) {
        notFoundCols.push(keys.toLowerCase());
      }
    }

    if (notFoundCols.length > 0) {
      this.error(
        res,
        "--pageBuilder/missing-colums",
        `Notion page is missing some fields.`,
        400,
        { fields: notFoundCols }
      );
      return;
    }

    // create new one.
    await prisma.site.create({
      data: {
        id: uuidv4(),
        name: "",
        pageType: "",
        slug: "",
        themeName: "",
        notionDatabaseId: databaseId,
        socialLinks: JSON.stringify([]),
        userId: uId,
      },
    });

    this.success(
      res,
      "--pageBuilder/notion-verified",
      "Notion content verified successfully.",
      200,
      pageContent
    );
  }
}
