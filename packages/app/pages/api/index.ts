import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "./middlewares/catchError";

function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: "John Doe" });
}

export default CatchErrors(handler);
