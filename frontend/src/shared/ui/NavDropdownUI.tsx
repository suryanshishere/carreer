import React, { ReactNode, ReactElement } from "react";

interface NavDropdownUIProps {
  isVisible: boolean;
  children: ReactNode;
  className?: string;
}

const NavDropdownUI: React.FC<NavDropdownUIProps> = ({ isVisible, children, className }) => {
  if (!isVisible) return null;

  const childArray = React.Children.toArray(children).filter(Boolean); // Remove falsy values

  return (
    <div className="absolute rounded top-full mt-1 w-full bg-custom_less_gray z-10 shadow-md shadow-custom_black p-1">
      <div className={`flex flex-col ${className}`}>
        {childArray.map((child, index) => {
          if (React.isValidElement<{ className?: string }>(child)) {
            return (
              <React.Fragment key={index}>
                {React.cloneElement(child as ReactElement<{ className?: string }>, {
                  className: `py-1 rounded text-center block hover:bg-custom_white ${
                    child.props.className || ""
                  }`,
                })}
                {index < childArray.length - 1 && <hr className="my-1" />}
              </React.Fragment>
            );
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default NavDropdownUI;
