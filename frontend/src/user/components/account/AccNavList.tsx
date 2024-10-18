import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import NAV_ACCOUNT from "db/nav/NavAccount.json";
import { Button, Menu, MenuItem, Fade } from "@mui/material";
import "./AccNavList.css";

//TODO: Improve the design
const AccNavList: React.FC = () => {
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    auth.logout();
    handleClose();
  };

  if (NAV_ACCOUNT.length === 0) return null;

  return (
    <>
      <Button
        id="account-button"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="account_icon nav_link"
      >
        {/* <FontAwesomeIcon icon={faUser} /> */}
      </Button>
      <Menu
        id="account-menu"
        MenuListProps={{
          "aria-labelledby": "account-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {NAV_ACCOUNT.map((item, index) => (
          <MenuItem key={index} onClick={handleClose}>
            <Link to={item.link} className="nav_li w-full">
              {item.header}
            </Link>
          </MenuItem>
        ))}
        <MenuItem onClick={logoutHandler}>Log out</MenuItem>
      </Menu>
    </>
  );
};

export default AccNavList;
