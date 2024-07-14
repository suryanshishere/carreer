import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./navigation/Main";
import Footer from "./footer/Footer";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Loading from "shared/components/uiElements/common/response/Loading";
import Features from "general/pages/features/Features";
import "./RootLayout.css";

const Layout: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.response.isLoading);

  return (
    <div className="w-full flex flex-col min-h-screen relative pb-20">
      {isLoading && <Loading loadingOnTop />}

      <MainNavigation />
      <Features />

      <div className="outlet flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
