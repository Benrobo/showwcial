import { NextApiRequest, NextApiResponse } from "next";
import { LoginSchema, VerifyUserSchema } from "../helper/validator";
import BaseController from "./base";
import $axios from "../config/axios";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import memcache from "memory-cache";
import { sendMail } from "../helper/sendMail";
import JsonWebToken from "../helper/jwt";

export default class ChatController extends BaseController {
  public async fetchMessages(req: NextApiRequest, res: NextApiResponse) {}

  public async fetchUsers(req: NextApiRequest, res: NextApiResponse) {
    const reqUser = req["user"];
    const allusers = await prisma.users.findMany();
    const filteredUsers = allusers.filter((user) => user.id !== reqUser.id);

    this.success(
      res,
      "--chatUsers/fetched",
      "chat users fetched.",
      200,
      filteredUsers
    );
  }
}
