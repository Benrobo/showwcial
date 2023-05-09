import { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";
import ip from "ip";

const nodeCache = new NodeCache();

// basic auth
export function basicRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const MAX_REQUEST = 1;
    const windowMs = 60 * 1000;
    const userIp = ip.address();
    let requestCount: number = nodeCache.get(userIp) ?? 0;

    if (requestCount > MAX_REQUEST) {
      return res.status(429).json({
        errorStatus: true,
        code: `--serverRequest/too-many-requests`,
        message: "Too many request, initiate a new request after 10sec",
        data: null,
        statusCode: 429,
      });
    }

    requestCount++;

    nodeCache.set(userIp, requestCount, windowMs);

    return handler(req, res);
  };
}
