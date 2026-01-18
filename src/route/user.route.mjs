import { Router } from "express";
import { UserController } from "../features/user/user.controller.mjs";

const router = Router();

router.route("/register").post(UserController.createUser);
router.route("/login").post(UserController.login);

export default router;
