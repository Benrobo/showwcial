import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
// import { isLoggedIn } from "../middlewares/auth";
import NotifierController from "../controllers/notifier";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notifier = new NotifierController();

  if (req.method === "POST") {
    await notifier.fetchThreads(req, res);
  }
}

export default CatchErrors(handler);
