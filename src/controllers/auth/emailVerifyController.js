import { emailVerifyService } from "../../services/auth/emailVerifyService.js";

export const emailVerifyController = async (req, res) => {
  try {
    const { emailVerificationCode, id } = req.body;
    const updatedUser = await emailVerifyService(emailVerificationCode, id);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
