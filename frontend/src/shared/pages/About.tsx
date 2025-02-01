import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col gap-2 text-base lg:w-2/3 w-full ">
        <h2 className="self-start py-1 text-custom-gray w-fit font-bold text-lg">
          About
        </h2>
        <p>
          1. A web application for users who want to apply for government posts.
          <br />
          <br />
          2. Its exclusive purpose is to maintain a consistent platform where
          users can reliably apply, access information, and discover
          opportunities of interest they might not have known about initially.
          <br />
          <br />
          3. Aims to absolutely reduce the complexity of government post
          application procedures into a single data-driven platform.
        </p>

        <br />
        <br />

        <span className="font-semibold">
          For job application, suggestion, and other related query:
          <Link
            className="text-custom-red hover:underline pl-2"
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
