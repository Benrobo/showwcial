import BaseController from "./base";
import prisma from "../config/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { isEmpty } from "../../../util";
import { v4 as uuidv4 } from "uuid";

export default class MeetController extends BaseController {
  constructor() {
    super();
  }

  private genMeetingId(len: number = 3) {
    const char = "abcdefghijklmnopqrstuvwxyz".split("");
    let generated = "";
    for (let i = 0; i < len; i++) {
      const rand = Math.floor(Math.random() * char.length);
      generated += char[rand];
    }
    return generated;
  }

  public async getMeetings(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const userId = reqUser["id"];

    const meetings = await prisma.meet.findMany({
      where: { userId },
    });

    this.success(
      res,
      "--meeting/fetched",
      "Meeting successfully fetched.",
      200,
      meetings
    );
  }

  public async getMeetingById(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;

    const meeting = await prisma.meet.findFirst({
      where: { slug: payload.slug },
    });

    if (isEmpty(payload.slug)) {
      this.error(res, "--meeting/notfound", "meeting notfound.", 404);
      return;
    }

    this.success(
      res,
      "--meeting/fetched-successfully",
      "Meeting successfully fetched.",
      200,
      meeting
    );
  }

  public async create(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const userId = reqUser["id"];
    const payload = req.body.name as string;

    if (isEmpty(payload)) {
      this.error(res, "--meeting/field-empty", "meeting name is missing.", 404);
      return;
    }

    const meetId = `${this.genMeetingId(3).toUpperCase()}-${this.genMeetingId(
      3
    ).toUpperCase()}-${this.genMeetingId(3).toUpperCase()}`;

    await prisma.meet.create({
      data: {
        id: uuidv4(),
        slug: meetId,
        name: payload,
        userId,
      },
    });

    this.success(
      res,
      "--meeting/success",
      "Meeting successfully created.",
      200
    );
  }

  public async delete(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const userId = reqUser["id"];
    const payload = req.body.id as string;

    if (isEmpty(payload)) {
      this.error(res, "--meeting/field-empty", "meeting id is missing.", 404);
      return;
    }

    // check if id exists
    const meetExists = await prisma.meet.findFirst({
      where: { id: payload, userId },
    });

    if (isEmpty(meetExists)) {
      this.error(
        res,
        "--meeting/notfound",
        "Failed to delete. meeting doesn't exists.",
        403
      );
      return;
    }

    await prisma.meet.delete({ where: { id: payload } });

    this.success(
      res,
      "--meeting/success",
      "Meeting successfully deleted.",
      200,
      { id: payload }
    );
  }
}
