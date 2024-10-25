import React, { useContext, useState } from "react";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import AccNavList from "user/components/account/AccNavList";
import Auth from "user/pages/auth/Auth";
import Modal from "shared/uiComponents/modal/Modal";
import { NavLink, useLocation } from "react-router-dom";

const NavAccount = () => {
  const auth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const LoginSignup = (
    <>
      <button onClick={() => setShowModal(true)}>Login / Signup</button>
      {showModal && (
        <Modal
          header="Authentication"
          onClose={() => setShowModal(false)}
          className="bg-custom-white rounded fixed top-1/2 left-1/2 h-max-[25rem] w-50 z-50 translate-x-[-50%] translate-y-[-50%]"
        >
          <Auth onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );

  return (
    <div>
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
