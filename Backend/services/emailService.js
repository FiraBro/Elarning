const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM || `App Name <no-reply@yourdomain.com>`;
  }

  // Create appropriate transporter based on environment
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // SendGrid for production
      return nodemailer.createTransport({
        service: "SendGrid",
        // auth: {
        //   user: process.env.SENDGRID_USERNAME,
        //   pass: process.env.SENDGRID_PASSWORD,
        // },
      });
    }

    // Gmail for development
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  // Load HTML template
  async loadTemplate(templateName) {
    const templatePath = path.join(
      __dirname,
      "..",
      "email-templates",
      `${templateName}.html`
    );

    let html = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders
    html = html
      .replace(/{{firstName}}/g, this.firstName)
      .replace(/{{url}}/g, this.url)
      .replace(/{{year}}/g, new Date().getFullYear());

    return html;
  }

  // Send email
  async send(template, subject) {
    // 1) Get HTML template
    const html = await this.loadTemplate(template);

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) Send email
    await this.newTransport().sendMail(mailOptions);
  }

  // Specific email methods
  async sendWelcome() {
    await this.send("welcome", "Welcome to our Elarning Platform!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for 10 minutes)"
    );
  }
  async sendPasswordChangeNotification() {
    await this.send(
      "passwordChange",
      "Your password is changed 10 minutes ago"
    );
  }
};
