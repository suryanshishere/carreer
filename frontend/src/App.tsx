import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "post/pages/Home";
import Detail from "post/pages/Detail";
import Category from "post/pages/Category";
import ContactUs from "shared/pages/contactUs/ContactUs";
import Saved from "./user/pages/Saved";
import ActivateModal from "./user/pages/account/ActivateModal";
import NotFound from "./shared/pages/NotFound";

import ResetPassword from "user/components/auth/ResetPassword";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const App: React.FC = () => {
  //context won't work here
  const { token } = useSelector((state: RootState) => state.auth.userData);

  const authRoutes =
    token || !token
      ? [
          { path: "saved_exam", element: <Saved /> },
          // { path: "setting", element: <Setting /> },
          {
            path: "account",
            children: [
              // { path: "contribute_to_post", element: <ContributeToPost /> },
              // {
              //   path: "contribute_to_post/:post_section",
              //   element: <PostFinalizer />,
              // },
              // {
              //   path: "contribute_to_post/:post_section/:post_id",
              //   element: <PostSectionForm />,
              // },
            ],
          },
          {
            path: "reset_password/:resetPasswordToken",
            element: <ResetPassword />,
          },
          { path: "*", element: <NotFound /> },
        ]
      : [
          {
            path: "reset_password/:resetPasswordToken",
            element: <ResetPassword />,
          },
          // { path: "account/contribute_to_post", element: <ContributeToPost /> },
          // {
          //   path: "account/contribute_to_post/:post_section",
          //   element: <PostSectionForm />,
          // },
        ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
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
        { path: "contact_us", element: <ContactUs /> },
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
