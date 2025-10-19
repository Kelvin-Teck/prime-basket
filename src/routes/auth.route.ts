import { Router } from "express";
import { registerSchema, loginSchema } from "../validators";
import { validate } from "../middleware/validation";
import * as authController from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();


router.post("/register", [validate(registerSchema)], asyncHandler( authController.register))
    .post("/login", [validate(loginSchema)], asyncHandler(authController.login));

export default router;
