import { RouteObject } from "react-router-dom";
import ResetPassword from "users/pages/auth/ResetPassword";
import Section from "posts/pages/Section";
import PostDetail from "posts/pages/PostDetail";
import Home from "posts/pages/Home";
import userRoutes from "./user-routes";
import adminRoutes from "./admin-routes";
import { IRole } from "admin/db";

export const authRoutes = (token: string | null, role?: IRole) => {
  return [...adminRoutes(token, role), ...userRoutes(token, role)];
};

export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: "sections/:section",
    children: [
      { index: true, element: <Section /> },
      { path: ":postCode/:version?", element: <PostDetail /> },
    ],
  },
];
