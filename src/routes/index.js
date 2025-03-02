import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema, registerSchema } from "../utils/schema.js";
import { loginAction, registerAction } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerAction);
router.post("/login", validateRequest(loginSchema), loginAction);

export default router;
