import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 min-mt-screen px-page py-4 flex justify-between items-end w-full text-sm text-gray-600">
      <div className="select-none">
        Copyright &copy; 2024 All Rights Reserved by <b>theJobs</b>
      </div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact_us" className="hover:underline">
            Contact Us
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
