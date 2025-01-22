import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ContactUs from "shared/pages/ContactUs";
import NotFound from "./shared/pages/NotFound";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
<<<<<<< HEAD
import { createAuthRoutes, publicRoutes } from "routes/app-routes";
=======
import { authRoutes, publicRoutes } from "layout/routes/app-routes";
>>>>>>> user
import About from "shared/pages/About";

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
        ...authRoutes(token, role),
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
