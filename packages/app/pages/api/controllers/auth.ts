import { NextApiRequest, NextApiResponse } from "next";
import {
  LoginSchema,
  ResetPwdSchema,
  VerifyUserSchema,
} from "../helper/validator";
import BaseController from "./base";
import $axios from "../config/axios";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import memcache from "memory-cache";
import JsonWebToken from "../helper/jwt";
import { isEmpty } from "../../../util";
import sendCustomMail from "../helper/sendEmail";
import ENV from "../config/env";
// import { sendMail } from "../helper/sendMail";

interface PasswordReseCacheProp {
  token?: string;
}

const jwt = new JsonWebToken();

export default class Authentication extends BaseController {
  protected loginSchema;
  protected VerifyUserSchema;
  protected ResetPwdSchema;
  public constructor() {
    super();
    this.loginSchema = LoginSchema;
    this.VerifyUserSchema = VerifyUserSchema;
    this.ResetPwdSchema = ResetPwdSchema;
  }

  public async doesShowwcaseUserExists(username: string, email: string) {
    try {
      const isUsernameExists = await $axios
        .get(`/users/check?username=${username}`)
        .then((r) => r.data);
      const isEmailExists = await $axios
        .get(`/users/check?email=${email}`)
        .then((r) => r.data);

      const req = Promise.all([isUsernameExists, isEmailExists]).then(
        (result) => {
          const [userName, userEmail] = result;
          return {
            usernameExists: userName?.available === false ? true : false,
            emailExists: userEmail?.available === false ? true : false,
          };
        }
      );
      return req;
    } catch (e: any) {
      console.log(`Error: ${e}`);
      return null;
    }
  }

  public async verifyOAuthAccount(req: NextApiRequest, res: NextApiResponse) {
    const userData = req.body;
    const { error, value } = this.VerifyUserSchema.validate(userData);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--auth/invalid-fields", msg, 400);
      return;
    }

    const validShowwcaseCredentialData = await this.doesShowwcaseUserExists(
      userData?.username,
      userData?.email
    );

    if (validShowwcaseCredentialData === null) {
      // invalid showwcase credentials
      this.error(
        res,
        "--auth/server-error",
        `Something went wrong verifying showwcase credentials.`,
        400
      );
      return;
    }

    const { usernameExists, emailExists } = validShowwcaseCredentialData;

    if (usernameExists === false && emailExists === false) {
      // user doesnt exists on showwcase, return invalid credentials.
      this.error(
        res,
        "--auth/invalid-credentials",
        `User wasn't found or one of the credentials is invalid.`,
        404
      );
      return;
    }
    if (usernameExists === false && emailExists === true) {
      // user doesnt exists on showwcase, return invalid credentials.
      this.error(
        res,
        "--auth/invalid-credentials",
        `User wasn't found or one of the credentials is invalid.`,
        404
      );
      return;
    }
    if (usernameExists === true && emailExists === false) {
      // user doesnt exists on showwcase, return invalid credentials.
      this.error(
        res,
        "--auth/invalid-credentials",
        `User wasn't found or one of the credentials is invalid.`,
        404
      );
      return;
    }

    // check if user has an account with showwcial
    const user = await prisma.users.findMany({
      where: { email: userData.email },
    });

    if (user.length > 0) {
      // * send success response to client.
      console.log("user exists");
      this.success(res, "--auth/account-verified", `Login to continue.`, 200);
      return;
    }

    // create a new user record in database.
    const defaultPwd = this.generateTempPassword();
    const defaultPwdHash = bcrypt.hashSync(defaultPwd, 10);
    const _userId = uuidv4().replace(/-/gi, "_");

    // cache timestamps in milliseconds
    const cacheTime = 30 * 60 * 1000;
    memcache.put(
      userData?.email,
      JSON.stringify({
        defaultPwd,
        defaultPwdHash,
        _userId,
        username: userData?.username,
        email: userData?.email,
      }),
      cacheTime
    );

    // send user temporary password.
    const mailBody = `
    <h2>Account Verification</h2>
    A user with this username <b>${userData?.username}</b> and email <b>${userData?.email}</b> try to login into Showwcial, if this was you use the temporary password below in verifying your account.
    </br>
    <p>Password: <b>${defaultPwd}</b></p>
    </br>
    Password expires in 30min time, use it before the expiration time.
    </br>
    </br>
    <h3>Please reset your default password after first time use.</h3>
    `;
    // await sendMail(userData?.email, "Verify Account", mailBody);
    await sendCustomMail(userData?.email, "Verify Account", mailBody);

    this.success(
      res,
      "--auth/verify-email",
      `Verify your email, check Inbox.`,
      200
    );
    return;
  }

  public async resendTempPwd(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.email;
    if (isEmpty(email)) {
      this.error(
        res,
        "--resendTempPwd/user-notfound",
        "User email is empty.",
        404
      );
      return;
    }

    // chekc if email exists in cache.
    const userCachedData = JSON.parse(memcache.get(email));
    if (userCachedData === null) {
      this.error(
        res,
        "--resendTempPwd/password-expired",
        "Temporary password expired, requests for new one.",
        400
      );
      return;
    }

    const { defaultPwd, defaultPwdHash, username, _userId } = userCachedData;

    const mailBody = `
    <h2>Account Verification</h2>
    A user with this username <b>${username}</b> and email <b>${email}</b> try to login into Showwcial, if this was you use the temporary password below in verifying your account.
    </br>
    <p>Password: <b>${defaultPwd}</b></p>
    </br>
    Password expires in 30min time, use it before the expiration time.
    </br>
    </br>
    <h3>Please reset your default password after first time use.</h3>
    `;
    // await sendMail(email, "Verify Account", mailBody);
    await sendCustomMail(email, "Verify Account", mailBody);

    // restore the default password in cache.
    const cacheTime = 30 * 60 * 1000;
    memcache.put(
      email,
      JSON.stringify({
        defaultPwd,
        defaultPwdHash,
        _userId,
        username,
        email,
      }),
      cacheTime
    );

    this.success(
      res,
      "--resendTempPwd/success",
      `temporary password sent..`,
      200
    );
  }

  public async fetchShowwcaseUserDetails(username: string) {
    try {
      const res = await $axios.get(`/user/${username}`).then((r) => r.data);
      return {
        displayName: res.displayName,
        githubProfile: res.githubProfile,
        headline: res.headline,
        location: res.location,
        profilePictureKey: res.profilePictureUrl,
      };
    } catch (e: any) {
      return null;
    }
  }

  public async login(req: NextApiRequest, res: NextApiResponse) {
    const userData = req.body;
    const { error, value } = this.loginSchema.validate(userData);
    if (typeof error !== "undefined") {
      const msg = error.message;
      return this.error(res, "--auth/invalid-fields", msg, 400);
    }

    // check if user exists.
    const dbUser = await prisma.users.findFirst({
      where: { email: userData?.email },
      include: { accounts: true },
    });

    if (dbUser !== null) {
      const { username, email, id } = dbUser;
      const userHash = dbUser.accounts?.hash;

      if (!bcrypt.compareSync(userData?.password, userHash)) {
        this.error(
          res,
          "--auth/password-incorrect",
          "password doesnt match our record.",
          400
        );
        return;
      }

      // const showwcaseUserInfo = await this.fetchShowwcaseUserDetails(username);
      const validUserData = {
        username,
        email,
        id,
        fullname: dbUser?.fullname,
        image: dbUser?.image,
      };

      // create new user in database.
      const refreshToken = jwt.generateRefreshToken(validUserData);
      const accessToken = jwt.generateAccessToken(validUserData);

      if (dbUser?.accounts?.refresh_token === "") {
        await prisma.accounts.update({
          where: { userId: id },
          data: {
            refresh_token: refreshToken,
          },
        });
      }

      validUserData["token"] = accessToken;

      this.success(
        res,
        "--auth/loggedIn",
        "logged in successfully",
        200,
        validUserData
      );
      return;
    }

    // get data from cache if user doesn't exist in database.
    const userCachedData = JSON.parse(memcache.get(userData?.email));

    if (userCachedData === null) {
      this.error(
        res,
        "--auth/password-expired",
        "Temporary password expired, requests for new one.",
        400
      );
      return;
    }

    const { defaultPwd, defaultPwdHash, username, email, _userId } =
      userCachedData;

    if (!bcrypt.compareSync(defaultPwd, defaultPwdHash)) {
      this.error(
        res,
        "--auth/password-incorrect",
        "password doesnt match our record.",
        400
      );
      return;
    }

    const showwcaseUserInfo = await this.fetchShowwcaseUserDetails(username);
    const validUserData = {
      username,
      email,
      id: _userId,
      fullname: showwcaseUserInfo?.displayName ?? "",
      image: showwcaseUserInfo?.profilePictureKey,
    };

    // create new user in database.
    const refreshToken = jwt.generateRefreshToken(validUserData);
    const accessToken = jwt.generateAccessToken(validUserData);

    await prisma.users.create({
      data: validUserData,
    });

    await prisma.accounts.create({
      data: {
        id: uuidv4(),
        userId: _userId,
        refresh_token: refreshToken,
        hash: defaultPwdHash,
      },
    });

    validUserData["token"] = accessToken;

    this.success(
      res,
      "--auth/loggedIn",
      "logged in successfully",
      200,
      validUserData
    );
  }

  public async verifyPwdReset(req: NextApiRequest, res: NextApiResponse) {
    const { token, email } = req.body;

    if (isEmpty(email)) {
      this.error(
        res,
        "--verifyPasswordReset/invalid-field",
        "Password reset link is invalid. 'email' is required.",
        404
      );
      return;
    }
    if (isEmpty(token)) {
      this.error(
        res,
        "--verifyPasswordReset/invalid-field",
        "Password reset link is invalid. 'token' is required.",
        404
      );
      return;
    }

    const userCachedData = JSON.parse(
      memcache.get(email)
    ) as PasswordReseCacheProp | null;

    if (isEmpty(userCachedData)) {
      this.error(
        res,
        "--verifyPasswordReset/invalid-token",
        "Password reset link is invalid. 'token' is invalid.",
        400
      );
      return;
    }

    // check if user exists.
    const userExist = await prisma.users.findFirst({ where: { email } });

    if (isEmpty(userExist)) {
      this.error(
        res,
        "--verifyPasswordReset/user-notfound",
        "Verification failed, user not found.",
        404
      );
      return;
    }

    this.success(
      res,
      "--verifyPasswordReset/verified",
      "Verification successful.",
      200
    );
  }

  public async sendPasswordResetLink(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { email } = req.body;
    if (isEmpty(email)) {
      this.error(
        res,
        "--sendResetLink/invalid-field",
        `Expected a valid email, but got none`,
        400
      );
      return;
    }

    // check if user with this email exists.
    const userExist = await prisma.users.findFirst({ where: { email } });
    if (isEmpty(userExist)) {
      this.error(
        res,
        "--sendResetLink/user-notfound",
        "Failed to send, user not found.",
        404
      );
      return;
    }

    const randToken = this.generateTempPassword();
    const cacheTime = 5 * 60 * 1000;
    memcache.put(
      email,
      JSON.stringify({
        token: randToken,
      }),
      cacheTime
    );

    const resetLink = `${ENV.clientUrl}/auth/forget-password?token=${randToken}`;

    const mailBody = `
    <h2>Password Reset</h2>
    A user with this username <b>${userExist?.username}</b> and email <b>${email}</b> try to request for password reset for Showwcial, if this wasn't you, please ignore the link below.
    </br>
    <p><b>${resetLink}</b></p>
    </br>
    Password reset link expires in 5min time, use it before the expiration time.
    </br>
    `;
    // await sendMail(email, "Verify Account", mailBody);
    await sendCustomMail(email, "Password Reset", mailBody);

    this.success(
      res,
      "--sendResetLink/success",
      `password reset link sent..`,
      200,
      { token: randToken }
    );
  }

  public async passwordReset(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;
    const { error, value } = this.ResetPwdSchema.validate(payload);
    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--passwordReset/invalid-fields", msg, 400);
      return;
    }

    const { email, newPassword, token } = payload;

    // check if token still exists in cache.
    const userCachedData = JSON.parse(
      memcache.get(email)
    ) as PasswordReseCacheProp | null;

    console.log({ userCachedData });

    if (isEmpty(userCachedData)) {
      this.error(
        res,
        "--passwordReset/invalid-token",
        "Password reset link is invalid. 'token' is invalid.",
        400
      );
      return;
    }

    const userExist = await prisma.users.findFirst({ where: { email } });

    if (isEmpty(userExist)) {
      this.error(
        res,
        "--passwordReset/user-notfound",
        "Password reset failed, user not found.",
        404
      );
      return;
    }

    if (userCachedData?.token !== token) {
      this.error(
        res,
        "--passwordReset/invalid-token",
        "Password reset link is invalid. 'token' is invalid.",
        404
      );
      return;
    }

    const pwdHash = bcrypt.hashSync(newPassword, 10);

    // update password.
    const userId = userExist?.id;
    await prisma.accounts.update({
      where: { userId },
      data: { hash: pwdHash },
    });

    // delete cached data
    memcache.del(email);

    this.success(
      res,
      "--passwordReset/successfull",
      "Password reset successfull.",
      200
    );
  }
}
