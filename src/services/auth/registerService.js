import bcrypt from "bcrypt";
import { isUserExist } from "../../utils/isUserExist.js";
import prisma from "../../utils/prisma.js";
import { sendEmail } from "../emailService.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";
import { emailVerificationHTML } from "../../email-templates/emailVerificationHTML.js";

export const registerService = async (data) => {
  const { fullname, username, email, password } = data;
  await isUserExist({ key: "email", value: email }, false);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const emailVerificationCode = generateVerificationCode();
  const hashedEmailVerificationCode = await bcrypt.hash(emailVerificationCode, 10); // Hash'le

  const user = await prisma.user.create({
    data: {
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
      emailVerificationCode: hashedEmailVerificationCode,
    },
  });

  const emailResponse = await sendEmail(email, fullname, "Email Verification Code", emailVerificationHTML(emailVerificationCode));

  if (!emailResponse || emailResponse.error) throw new Error("Email couldn't be sent.");

  const {
    id: userId,
    password: userPassword,
    emailVerificationCode: userEmailVerificationCode,
    isEmailVerified,
    emailVerificationCreatedAt,
    passwordResetCode,
    passwordResetExpires,
    wrongLoginAttempts,
    isBlocked,
    ...filteredUser
  } = user;

  return filteredUser;
};
