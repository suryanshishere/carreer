import { RouteObject } from "react-router-dom";
import Section from "posts/pages/Section";
import PostDetail from "posts/pages/PostDetail";
import Home from "posts/pages/Home";
import { useAdminRoutes } from "./admin-routes";
import { useUserRoutes } from "./user-routes";

export const useAuthRoutes = () => {
  const adminRoutes = useAdminRoutes();
  const userRoutes = useUserRoutes();
  return [...adminRoutes, ...userRoutes];
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
