import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ContactUs from "shared/pages/ContactUs";
import NotFound from "./shared/pages/NotFound";
import { publicRoutes, useAuthRoutes } from "routes/app-routes";
import About from "shared/pages/About";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        ...publicRoutes,
        ...useAuthRoutes(),
        { path: "contact-us", element: <ContactUs /> },
        { path: "about", element: <About /> },
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
