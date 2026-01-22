import { Router } from "express";
import { UserController } from "../features/user/user.controller.mjs";

const router = Router();

router.route("/register").post(UserController.createUser);
router.route("/login").post(UserController.login);
router.route("/email-available").post(UserController.emailAvailable);
router.route("/username-available").post(UserController.usernameAvailable);

export default router;
