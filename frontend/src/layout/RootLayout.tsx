import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./navigation/Main";
import Footer from "./footer/Footer";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Loading from "shared/feedback/response/Loading";
import Features from "general/pages/features/Features";
import "./RootLayout.css";
import AutoAuthCheck from "shared/feedback/emergency/AutoAuthCheck";

const RootLayout: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.response.isLoading);

  
  return (
    <div className="w-full flex flex-col min-h-screen relative pb-20">
      {isLoading && <Loading loadingOnTop />}

      <AutoAuthCheck />;
      <MainNavigation />
      <Features />

      <div className="outlet flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
