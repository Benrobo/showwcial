import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import NotifierController from "../controllers/notifier";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notifier = new NotifierController();

  if (req.method === "POST") {
    await notifier.authenticateBot(req, res);
  }
}

export default CatchErrors(handler);
