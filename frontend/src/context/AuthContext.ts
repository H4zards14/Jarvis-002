import { createContext } from "react";
import type { AuthUser } from "../services/authApi";

export interface AuthContextType {
  user: AuthUser;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
