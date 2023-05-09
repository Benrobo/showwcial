import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import { isLoggedIn } from "../middlewares/auth";
import NotifierController from "../controllers/notifier";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notifier = new NotifierController();
  if (req.method === "GET") {
    await notifier.allVariants(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
