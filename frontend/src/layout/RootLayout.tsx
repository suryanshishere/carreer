import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "../shared/components/navigation/Main";
import Footer from "../shared/components/footer/Footer";
import AutoUserCheck from "shared/utilComponents/response/emergency/auto-user-check";
import { RootState } from "shared/utilComponents/store";
import Response from "shared/utilComponents/response/Response";
import Loading from "shared/utilComponents/response/dataStatus/Loading";
import { useSelector } from "react-redux";
import SendEmailVerification from "user/components/auth/SendEmailVerification";
import "./RootLayout.css";

const RootLayout: React.FC = () => {
  const loading = useSelector((state: RootState) => state.dataStatus.isLoading);
  AutoUserCheck();

  return (
    <div className="w-full flex flex-col min-h-screen relative pb-20">
      <MainNavigation />
      <Response />
      {loading && <Loading loadingOnTop />}
      <div className="outlet flex flex-col">
        <Outlet />
      </div>
      <SendEmailVerification />
      <Footer />
    </div>
  );
};

export default RootLayout;
