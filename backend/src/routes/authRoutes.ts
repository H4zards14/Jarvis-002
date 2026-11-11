import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  setupAdmin,
  login,
  getCurrentUser,
  logout,
  getCsrfToken,
} from "../controllers/authController.js";
import { csrfSynchronisedProtection } from "../middleware/csrf.js";

const router = Router();

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many setup attempts. Please try again later." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

router.get("/csrf-token", getCsrfToken);

router.post("/setup", setupLimiter, setupAdmin);
router.post("/login", loginLimiter, csrfSynchronisedProtection, login);
router.get("/me", getCurrentUser);
router.post("/logout", csrfSynchronisedProtection, logout);

export default router;
