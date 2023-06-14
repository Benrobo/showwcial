import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { Client } from "@notionhq/client";
import { isEmpty } from "../../../util";
import prisma from "../config/prisma";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { v4 as uuidv4 } from "uuid";
import { SiteSchema } from "../helper/validator";
import axios from "axios";

function notion(token: string) {
  const notion = new Client({
    auth: token,
  });
  return notion;
}

export default class PageBuilderController extends BaseController {
  private siteSchema: any;
  constructor() {
    super();
    this.siteSchema = SiteSchema;
  }

  private convertUidToUUID(str: string) {
    if (isEmpty(str)) return str;
    const uuid = `${str.substr(0, 8)}-${str.substr(8, 4)}-${str.substr(
      12,
      4
    )}-${str.substr(16, 4)}-${str.substr(20)}`;
    return uuid;
  }

  public catchNotionError(err: any, res: NextApiResponse) {
    if (err?.code === "unauthorized") {
      this.error(
        res,
        "--pageBuilder/invalid-notion-token",
        "Token is invalid, please update notion token.",
        500
      );
      return;
    }
    if (err?.code === "object_not_found") {
      this.error(
        res,
        "--pageBuilder/invalid-notion-url",
        `Notion page isn't connected to integration.${err.message}`,
        500
      );
      return;
    }
    this.error(
      res,
      "--pageBuilder/server-error",
      `Someting went wrong: ${err.message}`,
      500
    );
    return;
  }

  public async verifyNotionPage(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;
    const uId = req["user"]?.id;

    if (isEmpty(payload?.id)) {
      this.error(
        res,
        "--pageBuilder/invalid-notion-page",
        "Notion page id is missing.",
        400
      );
      return;
    }

    const userNotionToken = await prisma.settings.findFirst({
      where: { userId: uId },
    });

    let pageContent = <null | GetDatabaseResponse>null;

    try {
      const result = await notion(
        userNotionToken?.notionIntegrationToken
      ).databases.retrieve({ database_id: payload?.id });

      pageContent = result;
    } catch (e: any) {
      this.catchNotionError(e, res);
      return;
    }

    const databaseId = pageContent.id;

    // check if database id exists
    const notionDBIdExists = await prisma.site.findMany({
      where: { notionDatabaseId: databaseId },
    });

    if (notionDBIdExists.length > 0) {
      this.error(
        res,
        "--pageBuilder/notionPage-in-use",
        `Notion page is already in use.`,
        400,
        pageContent?.properties
      );
      return;
    }

    // check if it contains necessary information.
    // cols: Github Url, Description, Tags, Live Url, Image, Name
    const pageProperties = pageContent?.properties;
    const propKeys = Object.keys(pageProperties);
    const validCols = [
      "Github Url",
      "Description",
      "Tags",
      "Live Url",
      "Image",
      "Name",
    ];
    const notFoundCols = [];

    for (let i = 0; i < validCols.length; i++) {
      const keys = validCols[i];
      if (!propKeys.includes(keys)) {
        notFoundCols.push(keys.toLowerCase());
      }
    }

    if (notFoundCols.length > 0) {
      this.error(
        res,
        "--pageBuilder/missing-colums",
        `Notion page is missing some fields.`,
        400,
        { fields: notFoundCols }
      );
      return;
    }

    // create new one.
    await prisma.site.create({
      data: {
        id: uuidv4(),
        notionDatabaseId: databaseId,
        name: "",
        slug: "",
        pageType: "",
        themeName: "",
        userId: uId,
      },
    });

    this.success(
      res,
      "--pageBuilder/notion-verified",
      "Notion content verified successfully.",
      200,
      pageContent
    );
  }

  public async fetchUserDetails(username: string) {
    let response = {
      about: null,
      experiences: null,
      stacks: null,
      repo: null,
      socials: null,
      resumeUrl: null,
    };
    try {
      const userData = await axios
        .get(`https://cache.showwcase.com/user/${username}?t=${uuidv4()}`)
        .then((r) => r?.data);
      const experiences = await axios
        .get(
          `https://cache.showwcase.com/user/${username}/experiences?t=${uuidv4()}`
        )
        .then((r) => r?.data);
      const stacks = await axios
        .get(
          `https://cache.showwcase.com/user/${username}/stacks?t=${uuidv4()}`
        )
        .then((r) => r?.data);
      const ghRepo = await axios
        .get(
          `https://cache.showwcase.com/user/${username}/github_repos?t=${uuidv4()}`
        )
        .then((r) => r?.data);
      const socials = await axios
        .get(
          `https://cache.showwcase.com/user/${username}/socials?t=${uuidv4()}`
        )
        .then((r) => r?.data);

      const result = Promise.all([
        userData,
        experiences,
        stacks,
        ghRepo,
        socials,
      ]).then((res) => {
        const [userData, experiences, stacks, ghRepo, socials] = res;
        response["about"] = userData?.about;
        response["resumeUrl"] = userData?.resumeUrl;
        response["experiences"] = experiences;
        response["stacks"] =
          stacks?.length > 0 ? stacks?.map((d) => d?.stack?.name) : [];
        response["repo"] = ghRepo;
        response["socials"] = socials?.links;
        return response;
      });

      return result;
    } catch (e: any) {
      console.log(`Error: ${e}`);
      return response;
    }
  }

  public async createSite(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;
    const uId = req["user"]?.id;
    const { error, value } = this.siteSchema.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--pageBuilder/invalid-fields", msg, 400);
      return;
    }

    // check if slug exists
    const { slug, name, type, themeName, notionPageId } = payload;
    const slugExists = await prisma.site.findMany({ where: { slug } });

    if (slugExists.length > 0) {
      this.error(res, "--pageBuilder/slug-exists", "Slug already exists", 400);
      return;
    }

    // check if notion Id exits
    const notionExists = await prisma.site.findFirst({
      where: { notionDatabaseId: this.convertUidToUUID(notionPageId) },
      include: { user: true },
    });

    if (notionExists !== null) {
      // ! fetch user showwcase social links, experiences,
      const { about, experiences, repo, resumeUrl, socials, stacks } =
        await this.fetchUserDetails(notionExists?.user?.username);

      const githubRepoData = [];
      const socialLinks = [];
      const formatedExperiences = [];

      if (repo !== null) {
        repo.forEach((rp) => {
          if (rp?.pinned) {
            const repoInfo = {
              name: rp?.name,
              description: rp?.description,
              url: rp?.htmlUrl,
              tags: Object.keys(rp?.languages),
            };
            githubRepoData.push(repoInfo);
          }
        });
      }
      if (socials !== null && socials?.length > 0) {
        socials.forEach((s) => {
          let links = {
            label: s?.label,
            url: s?.value,
          };
          socialLinks.push(links);
        });
      }
      if (experiences !== null && experiences?.length > 0) {
        experiences.forEach((e) => {
          let exp = {
            id: e?.id,
            title: e?.title,
            companyName: e?.companyName,
            startDate: e?.startDate,
            endDate: e?.endDate,
            current: e?.current,
            description: e?.description,
          };
          formatedExperiences.push(exp);
        });
      }

      // update site
      await prisma.site.update({
        where: { id: notionExists?.id },
        data: {
          name,
          themeName,
          notionDatabaseId: notionPageId,
          slug,
          pageType: type,
          id: uuidv4(),
          userId: uId,
          portfolioData: {
            create: {
              id: uuidv4(),
              experiences: JSON.stringify(formatedExperiences),
              tagline: "I solve problem for a living.",
              socialLinks: JSON.stringify(socialLinks),
              headline:
                "Mission driven software engineer, with a passion for thoughtful UI design, collaboration, and teaching.",
              about,
              email: notionExists?.user?.email,
              resumeUrl,
              stacks: stacks ?? JSON.stringify([]),
              ghRepo: JSON.stringify(githubRepoData),
            },
          },
        },
      });

      this.success(
        res,
        "--pageBuilder/success",
        "Site created successfully.",
        200
      );
      return;
    }

    this.error(
      res,
      "--pageBuilder/verify-notion-page",
      "Missing Notion Page. Please verify notion page first.",
      400
    );
  }

  public async refetchPortfolioData(req: NextApiRequest, res: NextApiResponse) {
    const uId = req["user"]?.id;
    const params = req.query;

    if (isEmpty(params?.slug as string)) {
      this.error(
        res,
        "--refetchSiteData/invalid-fields",
        `Slug is empty.`,
        400
      );
      return;
    }

    const slug = params?.slug as string;

    // check if slug exists.
    const siteExists = await prisma.site.findFirst({
      where: { userId: uId, slug: slug },
    });

    if (siteExists === null) {
      this.error(
        res,
        "--refetchSiteData/site-not-found",
        "Site not found.",
        400
      );
      return;
    }

    const userData = await prisma.users.findFirst({ where: { id: uId } });

    // fetch portfolio data from showwcase.
    const { about, experiences, repo, resumeUrl, socials, stacks } =
      await this.fetchUserDetails(userData?.username);

    if (
      about === null ||
      repo === null ||
      experiences === null ||
      stacks === null ||
      resumeUrl === null
    ) {
      this.error(
        res,
        "--refetchSiteData/something-went-wrong",
        "Something went wrong... please try again.",
        400
      );
      return;
    }

    const githubRepoData = [];
    const socialLinks = [];
    const formatedExperiences = [];

    if (repo !== null) {
      repo.forEach((rp) => {
        if (rp?.pinned) {
          const repoInfo = {
            name: rp?.name,
            description: rp?.description,
            url: rp?.htmlUrl,
            tags: Object.keys(rp?.languages),
          };
          githubRepoData.push(repoInfo);
        }
      });
    }
    if (socials !== null && socials?.length > 0) {
      socials.forEach((s) => {
        let links = {
          label: s?.label,
          url: s?.value,
        };
        socialLinks.push(links);
      });
    }
    if (experiences !== null && experiences?.length > 0) {
      experiences.forEach((e) => {
        let exp = {
          id: e?.id,
          title: e?.title,
          companyName: e?.companyName,
          startDate: e?.startDate,
          endDate: e?.endDate,
          current: e?.current,
          description: e?.description,
        };
        formatedExperiences.push(exp);
      });
    }

    // update site
    await prisma.site.update({
      where: { id: siteExists?.id },
      data: {
        portfolioData: {
          update: {
            experiences: JSON.stringify(formatedExperiences),
            socialLinks: JSON.stringify(socialLinks),
            about,
            resumeUrl,
            stacks: stacks ?? JSON.stringify([]),
            ghRepo: JSON.stringify(githubRepoData),
          },
        },
      },
    });

    this.success(
      res,
      "--refetchSiteData/siteData-updated",
      "Site data updated successfully.",
      200
    );
  }

  public async getCreatedSites(req: NextApiRequest, res: NextApiResponse) {
    const uId = req["user"]?.id;
    const createdSites = await prisma.site.findMany({
      where: { userId: uId },
      include: { portfolioData: true },
    });

    createdSites.forEach((d) => {
      if (d?.portfolioData !== null) {
        const portfolio = d?.portfolioData;
        if (typeof portfolio?.ghRepo === "string") {
          d.portfolioData["ghRepo"] = JSON.parse(portfolio?.ghRepo);
        }
        if (typeof portfolio?.experiences === "string") {
          d.portfolioData["experiences"] = JSON.parse(portfolio?.experiences);
        }
        if (typeof portfolio?.socialLinks === "string") {
          d.portfolioData["socialLinks"] = JSON.parse(portfolio?.socialLinks);
        }
      }
    });

    this.success(
      res,
      "--pageBuilder/sites-fetched",
      "sites fetched successfully.",
      200,
      { sites: createdSites }
    );
  }

  public async getCreatedSiteBySlug(req: NextApiRequest, res: NextApiResponse) {
    const param = req.query;
    const slug = param["slug"] as string;

    // check if slug exists
    const slugExists = await prisma.site.findFirst({
      where: { slug },
    });

    if (slugExists === null) {
      this.error(res, "--siteBySlug/notfound", "site doesn't exist", 404);
      return;
    }

    const createdSites = await prisma.site.findFirst({
      where: { slug },
      include: { portfolioData: true },
    });

    const userData = await prisma.users.findFirst({
      where: { id: createdSites?.userId },
    });

    if (createdSites.portfolioData !== null) {
      const portfolio = createdSites?.portfolioData;

      createdSites.portfolioData["userImage"] = userData?.image;
      createdSites.portfolioData["fullname"] = userData?.fullname;

      createdSites[
        "showwcaseProfile"
      ] = `https://www.showwcase.com/${userData?.username}`;

      if (typeof portfolio?.ghRepo === "string") {
        createdSites.portfolioData["ghRepo"] = JSON.parse(portfolio?.ghRepo);
      }
      if (typeof portfolio?.experiences === "string") {
        createdSites.portfolioData["experiences"] = JSON.parse(
          portfolio?.experiences
        );
      }
      if (typeof portfolio?.socialLinks === "string") {
        createdSites.portfolioData["socialLinks"] = JSON.parse(
          portfolio?.socialLinks
        );
      }
    }

    // get users portfolio projects from notion page.
    const userId = createdSites?.userId;
    const userSetting = await prisma.settings.findFirst({ where: { userId } });
    const userNotionToken = userSetting?.notionIntegrationToken;
    const databaseId = createdSites?.notionDatabaseId;
    const portfolioProjects = [];

    try {
      const result = await notion(userNotionToken).databases.query({
        database_id: databaseId,
      });

      const page = result?.results;
      page.forEach((page) => {
        const portfolioData = (page as any).properties;
        const NAME = portfolioData?.Name?.title[0]?.plain_text ?? null;
        const GH_URL = portfolioData["Github Url"]?.url ?? null;
        const Description =
          portfolioData?.Description?.rich_text[0]?.plain_text ?? null;
        const IMAGE = portfolioData?.Image?.url ?? null;
        const LIVE_URL = portfolioData["Live Url"]?.url ?? null;
        const TAGS =
          portfolioData["Tags"]?.multi_select?.map((d) => d?.name) ?? null;

        portfolioProjects.push({
          name: NAME,
          ghUrl: GH_URL,
          description: Description,
          image: IMAGE,
          live_url: LIVE_URL,
          tags: TAGS,
        });
      });
    } catch (e: any) {
      console.log(
        `Error: failed to load portfolio data from notion page: ${e.message}`
      );
    }

    delete createdSites["notionDatabaseId"];

    delete createdSites["createdAt"];
    delete createdSites["id"];
    delete createdSites["userId"];

    this.success(
      res,
      "--siteBySlug/success",
      "sites fetched successfully.",
      200,
      {
        sites: {
          ...createdSites,
          portfolioProjects,
        },
      }
    );
  }

  public async updateSite(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;
    const uId = req["user"]?.id;
    if (isEmpty(payload?.slug)) {
      this.error(
        res,
        "--updateSite/invalid-fields",
        "Slug can't be empty.",
        400
      );
      return;
    }
    if (isEmpty(payload?.tagline)) {
      this.error(
        res,
        "--updateSite/invalid-fields",
        "Tagline can't be empty.",
        400
      );
      return;
    }
    if (isEmpty(payload?.headline)) {
      this.error(
        res,
        "--updateSite/invalid-fields",
        "Headline can't be empty.",
        400
      );
      return;
    }

    const { slug, tagline, headline } = payload;

    // check if slug is valid
    const slugValid = await prisma.site.findMany({
      where: { slug, userId: uId },
    });

    if (slugValid.length === 0) {
      this.error(res, "--updateSite/invalid-slug", "Slug is invalid.", 400);
      return;
    }

    await prisma.site.update({
      where: { slug },
      data: {
        portfolioData: {
          update: {
            tagline,
            headline,
          },
        },
      },
    });

    this.success(
      res,
      "--updateSite/success",
      "site updated successfully.",
      200
    );
  }

  public async deleteSite(req: NextApiRequest, res: NextApiResponse) {
    const uId = req["user"]?.id;
    const params = req.query;

    if (isEmpty(params?.slug as string)) {
      this.error(res, "--deleteSite/invalid-fields", "Slug is missing.", 400);
      return;
    }

    // check if slug is valid
    const siteExists = await prisma.site.findFirst({
      where: { userId: uId, slug: params?.slug as string },
    });

    if (siteExists === null) {
      this.error(
        res,
        "--deleteSite/failed",
        "Unauthorised or Site not found.",
        400
      );
      return;
    }

    await prisma.site.delete({
      where: { id: siteExists?.id },
    });

    await prisma.pageTracker.deleteMany({
      where: { slug: siteExists?.slug },
    });

    this.success(
      res,
      "--deleteSite/success",
      "site deleted successfully.",
      200
    );
  }

  public async getPageViews(req: NextApiRequest, res: NextApiResponse) {
    const slug = req.query["slug"] as string;

    if (isEmpty(slug)) {
      this.error(
        res,
        "--pageViews/slug-notfound",
        "Page slug can't be empty",
        400
      );
    }

    // check if slug exists
    const slugExists = await prisma.site.findFirst({ where: { slug } });

    if (slugExists === null) {
      this.error(
        res,
        "--pageViews/slug-notfound",
        "Site you're looking for doesn't exist.",
        404
      );
      return;
    }

    const trackerViews = await prisma.pageTracker.findMany({
      where: { slug },
    });

    const accumulatedViews = trackerViews.reduce((t, acc) => t + acc.views, 0);

    const returnedData = {
      page: slug,
      views: accumulatedViews,
    };

    this.success(
      res,
      "--pageViews/success",
      "Page views successfully fetched",
      200,
      returnedData
    );
  }

  public async getAllSitesViews(req: NextApiRequest, res: NextApiResponse) {
    const uId = req["user"]?.id as string;

    const trackPages = await prisma.pageTracker.findMany({
      where: { userId: uId },
    });

    const groupedSites = [];
    for (let i = 0; i < trackPages.length; i++) {
      const site = trackPages[i];
      // Check if the current site's slug is already in the groupedSites array
      const existingSite = groupedSites.find((s) => s.slug === site.slug);
      if (existingSite) {
        // If the slug already exists, add the current site's views to the total
        existingSite.views += site.views;
      } else {
        // Otherwise, add a new entry to the groupedSites array with the current site's slug and views
        groupedSites.push({
          slug: site.slug,
          views: site.views,
          date: site.createdAt,
        });
      }
    }

    this.success(
      res,
      "--pageViews/success",
      "Page views successfully fetched",
      200,
      groupedSites
    );
  }
}
