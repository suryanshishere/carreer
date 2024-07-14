import React from "react";
import ContactUsForm from "shared/pages/contactUs/Contact";
import "./Contact.css";

const ContactUs: React.FC = () => {
  return (
    <div className="contact_us_sec flex justify-center items-center">
      <ContactUsForm />
      <div className="about w-1/2">
        <h5 className="pl-0">About</h5>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet velit
          aperiam harum neque repudiandae reiciendis qui sed. Laboriosam,
          ducimus eius? Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Dolorem doloribus eum illum mollitia, eveniet maiores quod minima
          atque amet earum. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Repellat tempore at eius quia quidem numquam sed suscipit quis
          porro sint. Nesciunt cum dolore laboriosam debitis dolorem ducimus
          eveniet fuga nostrum!
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
