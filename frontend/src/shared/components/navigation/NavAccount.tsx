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

  let LoginSignup = (
    <>
      <Button
        classProp={` rounded-xl hover:bg-custom-less-red z-50 ${
          showModal ? `bg-custom-less-red` : `bg-custom-red`
        }`}
        onClick={() => setShowModal(!showModal)}
      >
        Login / Signup
      </Button>
      {/* {showModal && (
        //TODO: add above to subnav in horinzontal form
        <Modal
          header="Authentication"
          onClose={() => setShowModal(false)}
          className="fixed border-3 border-custom-less-red top-1/2  right-1/2 h-max-[25rem] text-custom-black bg-custom-white p-2 w-[25rem]"
        >
          <Auth onClose={() => setShowModal(false)} />
        </Modal>
      )} */}
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
