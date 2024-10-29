import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import AccNavList from "user/components/account/AccNavList";
import Auth from "user/pages/auth/Auth";
import Modal from "shared/uiComponents/modal/Modal";
import { NavLink, useLocation } from "react-router-dom";
import Button from "shared/utilComponents/form/Button";

const NavAccount = () => {
  const auth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    auth.authClickedHandler(showModal);
  }, [showModal]);

  useEffect(() => {
    setShowModal(auth.clickedAuth);
  }, [auth.clickedAuth]);

  let LoginSignup = (
    <>
      {!showModal && <Button
        classProp={` rounded z-50 bg-custom-red hover:bg-custom-less-red`}
        onClick={() => setShowModal(true)}
      >
        Login / Signup
      </Button>}
    </>
  );

  return (
    <div className="text-base">
      {!auth.isLoggedIn ? (
        LoginSignup
      ) : (
        <>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav_link_active nav_link" : "nav_link"
            }
            to="/user/saved_exam"
          >
            Saved
          </NavLink>
          <AccNavList />
        </>
      )}
    </div>
  );
};

export default NavAccount;
