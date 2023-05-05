import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { notion } from "../config";
import { isEmpty } from "../../../util";

export default class PageBuilderController extends BaseController {
  constructor() {
    super();
  }

  public async verifyNotionPage(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;

    if (isEmpty(payload?.id)) {
      this.error(
        res,
        "--pageBuilder/invalid-notion-page",
        "Notion page id is missing.",
        400
      );
      return;
    }
    try {
      const result = await notion.pages.retrieve({
        page_id: payload?.id,
      });
      //   https://www.notion.so/benrobo/Portfolio-f8dec7f670154145a0a0dc04fd07961f?pvs=4
      //   if(result?.code)

      res.json(result);
    } catch (e: any) {
      console.group(
        `Error verifying notion page: ${
          e?.message?.includes("path.database_id")
            ? "Page id is invalid"
            : "something went wrong"
        }`
      );
    }
  }
}
