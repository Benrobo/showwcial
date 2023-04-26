import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const CatchErrors = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.log({ err });
      res.status(500).json({
        errorStatus: true,
        statusCode: 500,
        code: "--api/server-error",
        message: "Something went wrong",
        details: {
          stacks: { err: err.stack },
        },
      });
    }
  };
};
