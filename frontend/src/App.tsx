import React from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "post/pages/Home";
import Detail from "post/pages/Detail";
import Section from "post/pages/Section";
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
import { createAuthRoutes, publicRoutes } from "routes/app-routes";

const App: React.FC = () => {
  const { token, role } = useSelector(
    (state: RootState) => state.auth.userData
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        ...publicRoutes,
        ...createAuthRoutes(token, role),
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
