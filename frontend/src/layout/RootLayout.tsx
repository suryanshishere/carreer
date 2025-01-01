import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "shared/components/footer/Footer";
import NavBar from "shared/components/navbar/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const RootLayout: React.FC = () => {
  const isNavAuthClicked = useSelector(
    (state: RootState) => state.auth.isNavAuthClicked
  );
  const { isEmailVerified, token, deactivatedAt } = useSelector(
    (state: RootState) => state.auth.userData
  );

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div
        className={`flex-grow px-page mt-nav-overall mb-footer transition-transform ease-in-out duration-300 ${
          isNavAuthClicked || (token && (!isEmailVerified || deactivatedAt))
            ? "translate-y-auth-nav"
            : "translate-y-0"
        }`}
      >
        <Outlet key={token || "no-token"} />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
