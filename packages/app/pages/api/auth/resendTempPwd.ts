import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import Authentication from "../controllers/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authentication = new Authentication();

  if (req.method === "POST") {
    await authentication.resendTempPwd(req, res);
  }
}

export default CatchErrors(handler);
