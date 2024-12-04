import { RouteObject } from "react-router-dom";
import SavedPosts from "user/pages/account/SavedPosts";
import ChangePassword from "user/pages/account/setting/ChangePassword";
import ForgotPassword from "user/pages/auth/ForgotPassword";
import DeactivateAccount from "user/pages/account/setting/DeactivateAccount";
import Setting from "user/pages/account/setting/Setting";
import ResetPassword from "user/pages/auth/ResetPassword";
import Section from "post/pages/Section";
import Detail from "post/pages/postDetail/PostDetail";
import Home from "post/pages/Home";
import publisherRoutes from "./publisher-routes";

export const createUserRoutes = (token: string | null) => {
  return token
    ? [
        {
          path: "user",
          children: [
            {
              path: "account",
              children: [
                { path: "saved-posts", element: <SavedPosts /> },
                {
                  path: "setting",
                  children: [
                    {
                      index: true,
                      element: <Setting />,
                    },
                    {
                      path: "change-password",
                      element: <ChangePassword />,
                    },
                    {
                      path: "forgot-password",
                      element: <ForgotPassword />,
                    },
                    {
                      path: "deactivate-account",
                      element: <DeactivateAccount />,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    : [];
};

export const createAuthRoutes = (token: string | null, role?: string) => {
  return [
    {
      path: "user/reset_password/:resetPasswordToken",
      element: <ResetPassword />,
    },
    ...publisherRoutes(token, role),
    ...createUserRoutes(token),
  ];
};

export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  {
    path: "sections/:section",
    children: [
      { index: true, element: <Section /> },
      { path: ":postId", element: <Detail /> },
    ],
  },
];
