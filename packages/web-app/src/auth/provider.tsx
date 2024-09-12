import React from "react";
import { authHandler } from "./session";
import { AuthContext } from "./context";
import { useAuth } from "../auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  let signin = (newUser: string, callback: VoidFunction) => {
    return authHandler.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return authHandler.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

export function RequireAuth() {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth/sign-in" state={{ from: location }} />;
  }

  return <Outlet />;
}