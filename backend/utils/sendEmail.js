const mailer = require("nodemailer");

const sendEmail = async (from, to, subject, message, reply_to) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const options = {
    from,
    to,
    subject,
    replyTo: reply_to,
    html: message,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
