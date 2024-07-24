import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./navigation/Main";
import Footer from "./footer/Footer";
import "./RootLayout.css";
import AutoUserCheck from "shared/response/emergency/auto-user-check";

const RootLayout: React.FC = () => {
  AutoUserCheck();

  return (
    <div className="w-full flex flex-col min-h-screen relative pb-20">
      <MainNavigation />

      <div className="outlet flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
