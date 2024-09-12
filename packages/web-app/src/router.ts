import { createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { RequireAuth } from "./auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RequireAuth,
    children: [
      {
        path: "",
        Component: Home
      }
    ]
  },
  {
    path: "/auth/sign-in",
    Component: Login,
  },
  {
    path: '/auth/sign-up',
    Component: Register
  }
]);