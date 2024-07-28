import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "shared/context/auth-context";
import AccNavList from "user/components/account/AccNavList";
import Auth from "user/pages/auth/Auth";
import Modal from "../../shared/components/uiElements/modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useLocation } from "react-router-dom";
import "./NavAccount.css"

const NavAccount = () => {
  const auth = useContext(AuthContext);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeAccount, setActiveAccount] = useState<boolean>(false);

  const location = useLocation();
  const includesUserRef = useRef<boolean>(false);
  const excludesSavedExamRef = useRef<boolean>(false);

  useEffect(() => {
    includesUserRef.current = location.pathname.includes("/user/");
    excludesSavedExamRef.current =
      !location.pathname.includes("/user/saved_exam");

    setActiveAccount(includesUserRef.current && excludesSavedExamRef.current);
  }, [location.pathname]);

  const handleDropdownToggle = () => {
    if (!activeAccount) {
      setActiveAccount(true);
    }
    setDropdownVisibility((prevVisibility) => !prevVisibility);
  };

  const closeDropdownHandler = () => {
    if (
      activeAccount &&
      (!excludesSavedExamRef.current ||
        (!includesUserRef.current && excludesSavedExamRef.current))
    ) {
      setActiveAccount(false);
    }
    setDropdownVisibility(false);
  };

  return (
    <div>
      {!auth.isLoggedIn ? (
        <>
          <button
            onClick={() => setShowModal(true)}
            className={showModal ? "nav_link_active upper" : "nav_link"}
          >
            Login / Signup
          </button>
          {showModal && (
            <Modal
              header="Authentication"
              backdropShow={showModal}
              onCancel={() => setShowModal(false)}
              onCancelBackdrop={() => setShowModal(true)}
              otherModal
            >
              <Auth onClose={() => setShowModal(false)} />
            </Modal>
          )}
        </>
      ) : (
        <ul className="p-0 m-0 flex-1 flex items-center max-w-fit justify-end">
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav_link_active nav_link" : "nav_link"
            }
            to="/user/saved_exam"
          >
            Saved
          </NavLink>
          <button
            className={
              activeAccount
                ? "nav_link_active account_icon nav_link"
                : "account_icon nav_link"
            }
            onClick={handleDropdownToggle}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          {dropdownVisibility && <AccNavList onClose={closeDropdownHandler} />}
        </ul>
      )}
    </div>
  );
};

export default NavAccount;
