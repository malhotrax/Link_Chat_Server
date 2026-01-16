import { Router } from "express";
import { createUser } from "../controller/userController.mjs";

const router = Router();

router.route("/register").post(createUser); 

export default router;