import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "src/shared/context/auth-context";
import NAV_ACCOUNT from "src/db/nav/NavAccount.json";
import UIDropdown from "src/shared/components/uiElements/UIDropdown";
import "./AccNavList.css";

interface NavListProps {
  onClose: () => void;
}

const AccNavList: React.FC<NavListProps> = ({ onClose }) => {
  const auth = useContext(AuthContext);

  const logoutHandler = () => {
    auth.logout();
    onClose();
  };

  if (NAV_ACCOUNT.length === 0) return null;

  return (
    <>
      <UIDropdown onClose={onClose} className="nav_list_sec" backdrop>
        {NAV_ACCOUNT.map((item, index) => (
          <Link
            key={index}
            className="nav_li w-full "
            to={item.link}
            onClick={onClose}
          >
            {item.header}
          </Link>
        ))}
        <li className="nav_li w-full " onClick={logoutHandler}>
          Log out
        </li>
      </UIDropdown>
    </>
  );
};

export default AccNavList;
