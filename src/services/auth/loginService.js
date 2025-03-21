import { isUserExist } from "../../utils/isUserExist.js";
import { validatePassword } from "../../utils/validatePassword.js";
import jwt from "jsonwebtoken";

export const loginService = async (data) => {
  const { email, password } = data;
  const user = await isUserExist({ key: "email", value: email }, true);
  if (user?.isBlocked) throw new Error("This user is blocked! Please change your password for unblock your account.");
  if (!user?.isEmailVerified) throw new Error("This user's email is not verified!");
  await validatePassword(password, user);
  const token = jwt.sign({ id: user.id, email: user.email, username: user?.username, fullname: user?.fullname }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  return token;
};
