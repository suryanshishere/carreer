import User from "@models/user/user_model";
import cron from "node-cron";

const EMAIL_VERIFICATION_TOKEN_EXPIRY =
  Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY) || 3;
const PASSWORD_RESET_TOKEN_EXPIRY =
  Number(process.env.PASSWORD_RESET_TOKEN_EXPIRY) || 3;

// Run every day, to clean unverified user and tokens
const userCleanupTask = () => {
  cron.schedule("0 0 * * *", async () => {
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = new Date();

    try {
      // Remove unverified users older than one day
      await User.deleteMany({
        isEmailVerified: false,
        createdAt: { $lt: new Date(now.getTime() - oneDay) },
      });
      // console.log("Unverified user data removed");
    } catch (error) {
      console.error(
        "Error clearing expired tokens or unverified users:",
        error
      );
    }
  });
};

export default userCleanupTask;
