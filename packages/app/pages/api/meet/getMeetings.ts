import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import { isLoggedIn } from "../middlewares/auth";
import MeetController from "../controllers/meet";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const meeting = new MeetController();

  if (req.method === "GET") {
    await meeting.getMeetings(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
