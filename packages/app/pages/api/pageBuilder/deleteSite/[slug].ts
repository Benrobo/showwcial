import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../../middlewares/catchError";
import PageBuilderController from "../../controllers/pageBuilder";
import { isLoggedIn } from "../../middlewares/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pageBuilder = new PageBuilderController();

  if (req.method === "DELETE") {
    await pageBuilder.deleteSite(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
