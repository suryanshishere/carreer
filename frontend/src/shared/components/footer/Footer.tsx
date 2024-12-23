import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "shared/store";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";
const Footer: React.FC = () => {
  const { role, token } = useSelector(
    (state: RootState) => state.auth.userData
  );
  return (
    <footer className="bottom-0 min-mt-screen bg-custom-pale-yellow py-4 flex justify-center items-end w-full gap-4 text-base text-gray-600">
      <div className="select-none self-center text-custom-less-gray">
        Copyright &copy; 2024 All Rights Reserved by <b>{LOGO}</b>
      </div>
      <Link to="/about" className="hover:underline text-custom-red">
        About
      </Link>
      <Link to="/contact-us" className="hover:underline text-custom-red">
        Contact Us
      </Link>
      {token && role && !["publisher", "admin"].includes(role) && (
        <Link
          to="/user/apply-for-publisher"
          className="hover:underline text-custom-red"
        >
          Request Publisher Access
        </Link>
      )}
    </footer>
  );
};

export default Footer;
