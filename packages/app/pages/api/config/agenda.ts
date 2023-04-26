import Agenda from "agenda";
import env from "./env";

const agendaConfig = new Agenda({ db: { address: env.mongoUrl } }).on(
  "error",
  (e) => {
    console.log(`E: ${e}`);
  }
);

export default agendaConfig;
