import { NextApiRequest, NextApiResponse } from "next";
import { isEmpty } from "../../../util";
import requestIp from "request-ip";
import memcache from "memory-cache";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";

export default function TrackVisitor(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    handler(req, res);
    const trackerId = req.headers["x-tracker-id"] as string;
    if (!isEmpty(trackerId)) {
      const slug = req.query["slug"] as string;
      const ipAddress = requestIp.getClientIp(req);

      const visitorExistsInCache = JSON.parse(memcache.get(ipAddress));

      // ! make sure vistor page visit has expired before adding new one.

      if (visitorExistsInCache !== null) {
        console.info(
          `\n Slow down.. You just visited this page a minute ago. .\n`
        );
        console.log(visitorExistsInCache);
        return;
      }

      const userData = await prisma.site.findFirst({ where: { slug } });
      const userId = userData?.userId;

      const siteExistsInTracker = await prisma.pageTracker.findMany({
        where: { slug, ipAddress },
      });

      if (siteExistsInTracker.length > 0) {
        let views = siteExistsInTracker[0]?.views;
        const incrementedViews = (views += 1);
        await prisma.pageTracker.update({
          where: { id: siteExistsInTracker[0]?.id },
          data: { views: incrementedViews },
        });

        console.log(
          `\n Site "${slug}" has ${incrementedViews}views. from ip: ${ipAddress}\n`
        );

        const cacheTime = 1 * 60 * 1000; // 1min

        memcache.put(
          ipAddress,
          JSON.stringify({
            slug,
            ipAddress,
          }),
          cacheTime
        );

        return;
      }

      const cacheTime = 1 * 60 * 1000; // 1min

      memcache.put(
        ipAddress,
        JSON.stringify({
          slug,
          ipAddress,
        }),
        cacheTime
      );

      //   Add to tracker table
      await prisma.pageTracker.create({
        data: {
          id: uuidv4(),
          slug,
          ipAddress,
          views: 1,
          userId,
        },
      });
    }
  };
}
