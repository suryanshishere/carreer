import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ContactUs from "shared/pages/contactUs/ContactUs";
import NotFound from "./shared/pages/NotFound";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
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
