import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "shared/context/auth-context";
import AccNavList from "user/components/account/AccNavList";
import Auth from "user/pages/auth/Auth";
import Modal from "../../shared/components/uiElements/modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import NAV from "db/nav/Nav.json";
import "./Navlinks.css";

const Navlinks: React.FC = () => {
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
      (!excludesSavedExamRef.current || (!includesUserRef.current && excludesSavedExamRef.current))
    ) {
      setActiveAccount(false);
    }
    setDropdownVisibility(false);
  };

  return (
    <ul className="nav_links p-0 m-0 flex-1 flex justify-between items-center">
      {NAV.map((item) =>
        item.link ? (
          <NavLink
            key={item.header}
            to={item.link}
            className={({ isActive }) =>
              isActive ? "nav_link_active nav_link" : "nav_link"
            }
          >
            {item.header}
          </NavLink>
        ) : (
          <React.Fragment key={item.header}></React.Fragment>
        )
      )}

      <div className="search_sec flex-1 flex items-center ">
        <input name="search" type="text" />
      </div>

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
              show={showModal}
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
    </ul>
  );
};

export default React.memo(Navlinks);
