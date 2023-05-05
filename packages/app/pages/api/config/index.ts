import { Client } from "@notionhq/client";
import ENV from "./env";

export const CLIENT_URL = "http://localhost:3000";

export const notion = new Client({ auth: ENV.notionApiToken });
