import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "shared/components/navigation/Main";
import Footer from "../shared/components/footer/Footer";
import { RootState } from "shared/utilComponents/store";
import Response from "shared/utilComponents/response/Response";
import Loading from "shared/utilComponents/response/dataStatus/Loading";
import { useSelector } from "react-redux";
import SendEmailVerification from "user/components/auth/EmailVerification";
import { AuthContext } from "shared/utilComponents/context/auth-context";

const RootLayout: React.FC = () => {
  const auth = useContext(AuthContext);
  const loading = useSelector((state: RootState) => state.dataStatus.isLoading);
  // AutoUserCheck();

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      <Response />
      {loading && <Loading loadingOnTop />}
      <div
        className={`flex-grow px-page mt-nav-overall mb-footer transition-transform ease-in-out duration-300 ${
          auth.clickedAuth ? "translate-y-auth-nav" : "translate-y-0"
        }`}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
