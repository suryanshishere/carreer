import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "layout/footer/Footer";
import NavBar from "layout/navbar/NavBar";
import Response from "shared/utils/api/Response";
import AuthChecker from "users/pages/auth/AuthChecker";

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Response />
      <AuthChecker />
      <div className="flex-grow page_padding mt-8 mb-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
