import { RouteObject } from "react-router-dom";
import ResetPassword from "user/pages/auth/ResetPassword";
import Section from "post/pages/Section";
import PostDetail from "post/pages/PostDetail";
import Home from "post/pages/Home";
import userRoutes from "./user-routes";
import adminRoutes from "./admin-routes";

export const authRoutes = (token: string | null, role?: string) => {
  return [...adminRoutes(token, role), ...userRoutes(token, role)];
};

export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: "sections/:section",
    children: [
      { index: true, element: <Section /> },
      { path: ":nameOfThePost", element: <PostDetail /> },
    ],
  },
];
