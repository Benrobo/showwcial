import type { NextApiRequest, NextApiResponse } from "next";
import { CatchErrors } from "../middlewares/catchError";
import { isLoggedIn } from "../middlewares/auth";
import BookmarkController from "../controllers/bookmark";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bookmarkController = new BookmarkController();

  if (req.method === "POST") {
    await bookmarkController.bookmarkThread(req, res);
  }
  if (req.method === "GET") {
    await bookmarkController.fetchAllBookmarks(req, res);
  }
}

export default isLoggedIn(CatchErrors(handler));
