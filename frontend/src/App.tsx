import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import HomePage from "general/pages/home/Home";
import Detail from "general/pages/details/Detail";
import LinksList from "general/pages/category/CategoryList";
import ContactUs from "general/pages/contact_us/Contact";
import {
  AuthContext,
  AuthContextProvider,
} from "./shared/context/auth-context";
import Saved from "./user/pages/Saved";
import Setting from "./user/pages/account/Setting";
import Profile from "./user/pages/account/Profile";
import ActivateModal from "./user/pages/account/ActivateModal";
import NotFound from "./shared/pages/NotFound";
import Create from "./user/pages/account/Create";

const App: React.FC = () => {
  const auth = useContext(AuthContext);
  const authRoutes = auth.isLoggedIn
    ? [
        { path: "saved_exam", element: <Saved /> },
        { path: "profile", element: <Profile /> },
        { path: "setting", element: <Setting /> },
        { path: "create", element: <Create /> },
        { path: "*", element: <NotFound /> },
      ]
    : [];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "category/:category",
          children: [
            { index: true, element: <LinksList /> },
            { path: ":examId", element: <Detail /> },
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
