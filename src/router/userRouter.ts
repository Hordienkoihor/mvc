import express from "express";
import type {getRequest} from "../types/getRequest.type.js";
import type {Request, Response} from "express";

const userRouter = express.Router();

userRouter.get("/", async (req: Request<{}, {}, {}, getRequest>, res) => {

})