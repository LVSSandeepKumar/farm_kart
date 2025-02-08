import { Router } from "express";
import { logout, login, signup } from "../controllers/user_controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;