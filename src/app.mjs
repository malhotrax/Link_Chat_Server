import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRoute from "./route/user.route.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";

app.use("/api/v1/user", userRoute);

app.use(errorHandler);

export default app;
