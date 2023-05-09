import env from "../config/env";
import nodemailer from "nodemailer";

const mailConfig = {
  host: env.emailHost,
  port: env.emailPort,
  auth: {
    user: env.emailUser,
    pass: env.emailPassword,
  },
};

// This doesn't send mail in background, instead, the user would have to wait till this  function finished processing, blocking any response from getting to client.
// I stoped using agenda due to the frequent fail mongodb connection happening each time a mail is been sent.
// Would look for an alternative, but for the mean time, this is what am gonna use.

export default async function sendCustomMail(
  to: string,
  subject: string,
  body: string
) {
  try {
    const transporter = nodemailer.createTransport(mailConfig);
    const mailOptions = {
      from: env.emailSender,
      to,
      subject,
      html: body,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Mail sent successfully. ${to}`);
  } catch (e: any) {
    console.error(`Failed sending mail: ${e}`);
  }
}
