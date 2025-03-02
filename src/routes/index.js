import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { signUpSchema } from "../utils/schema.js";
import { signUpAction } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateRequest(signUpSchema), signUpAction);

export default router;
