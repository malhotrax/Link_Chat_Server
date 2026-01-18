import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRoute from "./route/user.route.mjs";

app.use("/api/v1/users", userRoute);

export default app;
