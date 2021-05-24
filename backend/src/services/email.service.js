const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, html: text };
  await transport.sendMail(msg);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.frontEndHost}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: <a href=${verificationEmailUrl} > Email Verification </a>
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

//sendVerificationEmail("sashikanth5890@gmail.com", "justr token");

module.exports = {
  transport,
  sendEmail,
  sendVerificationEmail,
};
