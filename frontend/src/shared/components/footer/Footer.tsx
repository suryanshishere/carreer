import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bottom-2 flex justify-between items-end w-full">
      <div className="select-none">
        Copyright &copy; 2024 All Rights Reserved by <b>theJobs</b>
      </div>
      <ul className="footer_links p-0 m-0 flex">
          <li className="list-none"><Link to="/about">About</Link></li>
          <li className="list-none"><Link to="/contact_us">Contact Us</Link></li>
      </ul>
    </footer>
  );
};

export default Footer;
