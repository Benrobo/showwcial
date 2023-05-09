// ! this was commented out due to agenda reliability of connecting to mongodb server.

// import env from "../config/env";
// import nodemailer from "nodemailer";
// import agendaConfig from "../config/agenda";

// const mailConfig = {
//   host: env.emailHost,
//   port: env.emailPort,
//   auth: {
//     user: env.emailUser,
//     pass: env.emailPassword,
//   },
// };

// const agenda = agendaConfig;

// // init job queue using agenda
// agenda.define("send_email", { concurrency: 1 }, async (job, done) => {
//   try {
//     const transporter = nodemailer.createTransport(mailConfig);
//     const { to, subject, body, from }: any = job.attrs.data;
//     const mailOptions = {
//       from: env.emailSender,
//       to,
//       subject,
//       html: body,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log(`Mail sent successfully. ${to}`);
//     done();
//   } catch (e: any) {
//     console.error(`Failed sending mail: ${e}`);
//     done();
//   }
// });

// // schedule welcome mail
// agenda.define("send_welcome_mail", { concurrency: 1 }, async (job, done) => {
//   try {
//     const transporter = nodemailer.createTransport(mailConfig);
//     const { to, subject, body, from }: any = job.attrs.data;
//     const mailOptions = {
//       from: env.emailSender,
//       to,
//       subject,
//       html: body,
//     };
//     await transporter.sendMail(mailOptions);
//     console.info(`Mail sent successfully. ${to}`);
//     done();
//   } catch (e: any) {
//     console.info(`Failed sending welcome mail: ${e.message}`);
//     done();
//   }
// });

// (async function () {
//   // start the agenda server
//   await agenda.start();
// })();

// export async function sendMail(to: string, subject: string, body: string) {
//   agenda.schedule(new Date(), "send_email", { to, subject, body });
//   agenda.start();
// }

// export async function sendWelcomeMail(
//   to: string,
//   subject: string,
//   body: string
// ) {
//   agenda.schedule("in 1 minutes", "send_welcome_mail", {
//     to,
//     subject,
//     body,
//   });
//   agenda.start();
// }
