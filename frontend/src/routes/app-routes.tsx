import { RouteObject } from "react-router-dom";
import ResetPassword from "user/user-pages/auth/ResetPassword";
import Section from "post/post-pages/Section";
import PostDetail from "post/post-pages/PostDetail";
import Home from "post/post-pages/Home";
import userRoutes from "./user-routes";
import adminRoutes from "./admin-routes";
import { IRole } from "admin/admin-db";

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
