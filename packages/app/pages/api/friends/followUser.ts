import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import FriendController from "../controllers/friends";
import { isLoggedIn } from "../middlewares/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const friends = new FriendController();

  if (req.method === "POST") {
    await friends.bulkFollowUser(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
