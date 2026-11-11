import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "../config/database.js";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error(
    "SESSION_SECRET must be set to a random value of at least 32 characters.",
  );
}

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
  name: "jarvis.sid",
  store: new PgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});
