import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col gap-2 text-base lg:w-1/2 w-full ">
        <h2 className="self-start py-1 text-custom-gray w-fit font-bold text-lg">
          About
        </h2>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam
          placeat repellendus quas nemo perferendis, saepe dignissimos dicta
          consequuntur praesentium, ad quidem, dolor harum inventore tenetur
          esse aliquam! Possimus, sunt numquam. Lorem ipsum, dolor sit amet
          consectetur adipisicing elit. Cupiditate, mollitia saepe! Id dolores
          veritatis ea. Dolorum sed magni incidunt molestias? Rem possimus
          mollitia, recusandae et doloremque esse veniam aperiam reiciendis!
        </p>
        <span className="font-semibold">
          For job application, suggestion, and other related query:
          <Link className="text-custom-red hover:underline" to="/contact-us">
            Contact Us
          </Link>
        </span>
      </div>
    </div>
  );
};

export default About;
