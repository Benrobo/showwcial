import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../../middlewares/catchError";
import PageBuilderController from "../../controllers/pageBuilder";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pageBuilder = new PageBuilderController();

  if (req.method === "GET") {
    await pageBuilder.getCreatedSiteBySlug(req, res);
  }
}

export default CatchErrors(handler);
