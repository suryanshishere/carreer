import { RouteObject } from "react-router-dom";
import ResetPassword from "user/pages/auth/ResetPassword";
import Section from "post/post_pages/Section";
import PostDetail from "post/post_pages/PostDetail";
import Home from "post/post_pages/Home";
import userRoutes from "./user-routes";
import adminRoutes from "./admin-routes";
import { IRole } from "models/admin/IAdmin";

export const authRoutes = (token: string | null, role?: IRole) => {
  return [...adminRoutes(token, role), ...userRoutes(token, role)];
};

export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: "sections/:section",
    children: [
      { index: true, element: <Section /> },
      { path: ":postCode", element: <PostDetail /> },
    ],
  },
];
