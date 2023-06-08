import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
// import { isLoggedIn } from "../middlewares/auth";
import FriendController from "../controllers/friends";
import { isLoggedIn } from "../middlewares/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const friends = new FriendController();

  if (req.method === "GET") {
    await friends.getSuggestedFollowers(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
