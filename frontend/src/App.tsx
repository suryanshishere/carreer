import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "post/pages/Home";
import Detail from "post/pages/Detail";
import Category from "post/pages/Category";
import ContactUs from "shared/pages/contactUs/ContactUs";
import { AuthContextProvider } from "./shared/utilComponents/context/auth-context";
import Saved from "./user/pages/Saved";
import Setting from "./user/pages/account/Setting";
import Profile from "./user/pages/account/Profile";
import ActivateModal from "./user/pages/account/ActivateModal";
import NotFound from "./shared/pages/NotFound";
import ContributeToPost from "./user/pages/account/ContributeToPost";
import EmailVerification from "user/pages/auth/EmailVerification";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import ResetPassword from "user/components/auth/ResetPassword";
import Admin from "admin/pages/Admin";

const App: React.FC = () => {
  //context won't work here
  const { token } = useUserData();

  const authRoutes = token
    ? [
        { path: "saved_exam", element: <Saved /> },
        { path: "profile", element: <Profile /> },
        { path: "setting", element: <Setting /> },
        { path: "account/create_post", element: <ContributeToPost /> },
        {
          path: "email_verification/:verificationToken",
          element: <EmailVerification />,
        },
        { path: "reset_password/:resetToken", element: <ResetPassword /> },
        { path: "*", element: <NotFound /> },
      ]
    : [
        {
          path: "email_verification/:verificationToken",
          element: <EmailVerification />,
        },
        { path: "reset_password/:resetToken", element: <ResetPassword /> },
        { path: "account/create_post", element: <ContributeToPost /> },
      ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {path:"admin", element: <Admin/>},
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
    <AuthContextProvider>
      <RouterProvider router={router} />
      <ActivateModal />
    </AuthContextProvider>
  );
};

export default App;
