import type { Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";
import { createAdminAccount, loginAdmin } from "../auth/authService.js";
import { generateToken } from "../middleware/csrf.js";

export function getCsrfToken(req: Request, res: Response) {
  res.status(200).json({
    csrfToken: generateToken(req),
  });
}

function isValidSetupSecret(provided: string | undefined): boolean {
  const expected = process.env.AUTH_SETUP_SECRET;

  if (!expected || !provided) return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function setupAdmin(req: Request, res: Response) {
  try {
    if (!isValidSetupSecret(req.get("x-setup-secret"))) {
      res.status(403).json({ message: "Invalid setup authorization." });
      return;
    }

    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const cleanUsername = username.trim();

    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(cleanUsername)) {
      res.status(400).json({
        message:
          "Username must be 3–30 characters and use only letters, numbers, dots, underscores, or hyphens.",
      });
      return;
    }

    if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
      res.status(400).json({
        message:
          "Password must be at least 12 characters and no more than 72 UTF-8 bytes.",
      });
      return;
    }

    const user = await createAdminAccount(cleanUsername, password);

    res.status(201).json({
      message: "Private administrator account created successfully.",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "An administrator account already exists."
    ) {
      res
        .status(409)
        .json({ message: "An administrator account already exists." });
      return;
    }

    console.error("Account setup failed:", error);
    res
      .status(500)
      .json({ message: "Failed to create administrator account." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const user = await loginAdmin(username.trim(), password);

    if (!user) {
      res.status(401).json({ message: "Invalid username or password." });
      return;
    }

    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration failed:", error);
        res.status(500).json({ message: "Unable to start a login session." });
        return;
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save failed:", saveError);
          res.status(500).json({ message: "Unable to save login session." });
          return;
        }

        res.status(200).json({
          message: "Login successful.",
          user,
        });
      });
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
}

export function getCurrentUser(req: Request, res: Response) {
  if (!req.session.userId || !req.session.username) {
    res.status(401).json({ user: null });
    return;
  }

  res.status(200).json({
    user: {
      id: req.session.userId,
      username: req.session.username,
    },
  });
}

export function logout(req: Request, res: Response) {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout failed:", error);
      res.status(500).json({ message: "Unable to log out." });
      return;
    }

    res.clearCookie("jarvis.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully." });
  });
}
