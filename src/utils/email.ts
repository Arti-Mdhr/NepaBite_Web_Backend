import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

export const sendResetEmail = async (email: string, link: string) => {

  await transporter.sendMail({
    from: `"NepaBite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password.</p>

      <a href="${link}" 
      style="
      background:#E63946;
      padding:12px 20px;
      color:white;
      text-decoration:none;
      border-radius:6px;
      ">
      Reset Password
      </a>

      <p>This link expires in 1 hour.</p>
    `
  });

};