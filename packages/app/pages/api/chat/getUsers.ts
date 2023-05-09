// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import { isLoggedIn } from "../middlewares/auth";
import ChatController from "../controllers/chat";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chatController = new ChatController();
  if (req.method === "GET") {
    await chatController.fetchUsers(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
