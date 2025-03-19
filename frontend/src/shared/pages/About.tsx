import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "shared/ui/PageHeader";

const About:React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      <PageHeader header="About" subHeader="Our Purpose Explained Below" />
      <div className="flex flex-col gap-2 text-base lg:w-2/3 w-full">
        <p>
          1. A web application for users who want to apply for government posts.
          <br />
          2. Its exclusive purpose is to maintain a consistent platform where
          users can reliably apply, access information, and discover
          opportunities of interest they might not have known about initially.
          <br />
          3. Aims to absolutely reduce the complexity of government post
          application procedures into a single data-driven platform.
        </p>

        <br />

        <span className="font-semibold">
          For job application, suggestion, and other related query:
          <Link
            className="text-custom_red hover:underline pl-2"
            to="/contact-us"
          >
            Contact Us
          </Link>
        </span>
      </div>
    </div>
  );
};

export default About;
