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
        className={`flex-grow page-padding mt-4 mb-6 transition-transform ease-in-out duration-300`}
      >
        <Outlet key={token || "no-token"} />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
