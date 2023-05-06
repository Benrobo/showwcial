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
      if (e?.code === "unauthorized") {
        this.error(
          res,
          "--pageBuilder/invalid-notion-token",
          "Token is invalid, please update notion token.",
          500
        );
        return;
      }
      if (e?.code === "object_not_found") {
        this.error(
          res,
          "--pageBuilder/invalid-notion-url",
          `Notion page isn't connected to integration.${e.message}`,
          500
        );
        return;
      }
      this.error(
        res,
        "--pageBuilder/server-error",
        `Someting went wrong: ${e.message}`,
        500
      );
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
        .get(`https://cache.showwcase.com/user/${username}`)
        .then((r) => r?.data);
      const experiences = await axios
        .get(`https://cache.showwcase.com/user/${username}/experiences`)
        .then((r) => r?.data);
      const stacks = await axios
        .get(`https://cache.showwcase.com/user/${username}/stacks`)
        .then((r) => r?.data);
      const ghRepo = await axios
        .get(`https://cache.showwcase.com/user/${username}/github_repos`)
        .then((r) => r?.data);
      const socials = await axios
        .get(`https://cache.showwcase.com/user/${username}/socials`)
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
              headline: "I solve problem for a living.",
              socialLinks: JSON.stringify(socialLinks),
              tagline:
                "Mission driven software engineer, with a passion for thoughtful UI design, collaboration, and teaching.",
              about,
              email: notionExists?.user?.email,
              resumeUrl,
              stacks,
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
      "Please verify notion page first.",
      400
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
      "--pageBuilder/success",
      "sites fetched successfully.",
      200,
      { sites: createdSites }
    );
  }
}
