import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Footer from "shared/components/footer/Footer";
import { AuthContext } from "shared/context/auth-context";
import NavBar from "shared/components/navbar/NavBar";

const RootLayout: React.FC = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
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
