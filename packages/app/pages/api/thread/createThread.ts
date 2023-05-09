import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import ThreadController from "../controllers/thread";
import { isLoggedIn } from "../middlewares/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const threadController = new ThreadController();

  if (req.method === "POST") {
    await threadController.postThread(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
