import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "shared/components/footer/Footer";
import NavBar from "shared/components/navbar/NavBar";

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div
        className={`flex-grow page-padding mt-4 mb-20 transition-transform ease-in-out duration-300`}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
