import ENV from "../config/env";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export function isLoggedIn(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers["authorization"];

      if (!token || typeof token === "undefined") {
        return res.status(401).json({
          errorStatus: true,
          code: "--auth/authorization-token-notfound",
          message: `Authorization header expected a token but got none.`,
        });
      }
      let bearer = token.split(" ")[1];
      let decode = jwt.verify(bearer, ENV.jwtSecret) as any;

      // check if user exists
      const uId = decode?._id;
      const account = await prisma.users.findFirst({ where: { id: uId } });

      if (account === null) {
        res.status(404).json({
          errorStatus: true,
          code: "--auth/account-notfound",
          message: "failed to perform action, account doesn't exists.",
        });
        return;
      }

      req["user"] = decode;
      await handler(req, res);
    } catch (e: any) {
      console.error(`invalid jwt token: ${e?.message}`);
      return res.status(401).json({
        errorStatus: true,
        code: "--auth/invalid-token",
        error: e,
        message: `Authorization token is invalid.`,
      });
    }
  };
}
