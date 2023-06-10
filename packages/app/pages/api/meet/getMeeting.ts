import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import MeetController from "../controllers/meet";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const meeting = new MeetController();

  if (req.method === "POST") {
    await meeting.getMeetingById(req, res);
  }
}

export default CatchErrors(handler);
