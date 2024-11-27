import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "post/pages/Home";
import Detail from "post/pages/Detail";
import Category from "post/pages/Category";
import ContactUs from "shared/pages/contactUs/ContactUs";
import NotFound from "./shared/pages/NotFound";
import ResetPassword from "user/pages/auth/ResetPassword";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ChangePassword from "user/pages/account/setting/ChangePassword";
import ForgotPassword from "user/pages/auth/ForgotPassword";
import SavedPosts from "user/pages/account/SavedPosts";
import Setting from "user/pages/account/setting/Setting";
import DeactivateAccount from "user/pages/account/setting/DeactivateAccount";

const App: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);

  const authRoutes = token
    ? [
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
      ]
    : [
        {
          path: "reset_password/:resetPasswordToken",
          element: <ResetPassword />,
        },
      ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "category/:category",
          children: [
            { index: true, element: <Category /> },
            { path: ":postId", element: <Detail /> },
          ],
        },
        {
          path: "user",
          children: authRoutes,
        },
        { path: "contact-us", element: <ContactUs /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

// {
//   path: "admin",
//   children: [
//     { index: true, element: <Admin /> },
//     { path: "create_new_post", element: <CreateNewPost /> },
//     {
//       path: "posts",
//       children: [
//         { index: true, element: <EditPost /> },
//         { path: ":post_section", element: <EditPostComponent /> },
//         { path: ":post_section/:post_id", element: <EditPostItem /> },
//       ],
//     },
//     {
//       path: "approve_post",
//       children: [
//         { index: true, element: <ApprovePost /> },
//         { path: ":post_section", element: <AdminComponent /> },
//       ],
//     },
//   ],
// },

// { path: "contribute_to_post", element: <ContributeToPost /> },
// {
//   path: "contribute_to_post/:post_section",
//   element: <PostFinalizer />,
// },
// {
//   path: "contribute_to_post/:post_section/:post_id",
//   element: <PostSectionForm />,
// },
