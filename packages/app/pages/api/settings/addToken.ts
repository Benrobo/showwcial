import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import { isLoggedIn } from "../middlewares/auth";
import SettingsController from "../controllers/settings";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

function handler(req: NextApiRequest, res: NextApiResponse) {
  const settings = new SettingsController();
  if (req.method === "POST") {
    settings.addExternalCredentials(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
