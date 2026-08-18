import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

/**
 * Convenient hook for accessing authentication state.
 *
 * Instead of:
 *
 * useContext(AuthContext)
 *
 * components can simply use:
 *
 * useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};