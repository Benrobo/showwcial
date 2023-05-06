import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import { isLoggedIn } from "../middlewares/auth";
import SettingsController from "../controllers/settings";

function handler(req: NextApiRequest, res: NextApiResponse) {
  const settings = new SettingsController();
  if (req.method === "GET") {
    settings.getToken(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
