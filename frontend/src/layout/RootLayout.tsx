import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "shared/components/navigation/Main";
import Footer from "../shared/components/footer/Footer";
import { RootState } from "shared/utilComponents/store";
import Response from "shared/utilComponents/response/Response";
import Loading from "shared/utilComponents/response/dataStatus/Loading";
import { useSelector } from "react-redux";
import SendEmailVerification from "user/components/auth/SendEmailVerification";

const RootLayout: React.FC = () => {
  const loading = useSelector((state: RootState) => state.dataStatus.isLoading);
  // AutoUserCheck();

  return (
    <div className="">
      <MainNavigation />
      <Response />
      {loading && <Loading loadingOnTop />}
      <div className="px-page mt-nav-overall mb-footer">
        <Outlet />
      </div>
      <SendEmailVerification />
      <Footer />
    </div>
  );
};

export default RootLayout;
