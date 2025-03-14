import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "layout/footer/Footer";
import NavBar from "layout/navbar/NavBar";
import Response from "shared/utils/api/Response";

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Response />
      <div className="flex-grow page-padding mt-8 mb-20 transition-transform ease-in-out duration-300">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
