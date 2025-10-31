// routes/userRoutes.js
import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const router = express.Router();

// ================= AUTH =================
router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/resend-otp-forgot-password", authController.resendOtpForgotPassword);
router.post("/verify-forgot-password", authController.verifyForgotPassword);
router.post(
  "/reset-password",
  authController.verifyResetTokenCookie,
  authController.resetPassword
);

// ================= USER PROFILE =================
router
  .route("/me")
  .get(authController.protect, userController.getMe)
  .patch(
    authController.protect,
    uploadAvatar.single("avatar"),
    userController.updateMe
  );

// ================= ADDRESS =================
router.post("/address", authController.protect, userController.addAddress);
router.delete(
  "/address/:index",
  authController.protect,
  userController.deleteAddress
);

// ================= ADMIN CRUD =================
// router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
