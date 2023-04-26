import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import Authentication from "../controllers/auth";
import agendaConfig from "../config/agenda";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // try connecting agenda to mongodb before loading the controller method.
  agendaConfig
    .start()
    .then(() => console.log("Agenda connected to MongoDB"))
    .catch((err) => console.log(`Agenda failed to connect to MongoDB: ${err}`));

  const authentication = new Authentication();

  if (req.method === "POST") {
    await authentication.login(req, res);
  }
}

export default CatchErrors(handler);
