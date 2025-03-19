import React, { ReactNode, ReactElement } from "react";

interface NavDropdownUIProps {
  isVisible: boolean;
  children: ReactNode;
  className?: string;
}

const NavDropdownUI: React.FC<NavDropdownUIProps> = ({
  isVisible,
  children,
  className,
}) => {
  if (!isVisible) return null;
  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <div className="absolute flex flex-col text-center top-full mt-[4px] mobile:mt-[3px] w-full bg-custom_less_gray z-10 shadow-sm">
      {childArray.map((child, index) => {
        if (React.isValidElement<{ className?: string }>(child)) {
          return (
            <React.Fragment key={index}>
              {React.cloneElement(
                child as ReactElement<{ className?: string }>,
                {
                  className: `no-underline whitespace-nowrap ${
                    child.props.className || ""
                  }`,
                }
              )}
              {index < childArray.length - 1 && <hr  />}
            </React.Fragment>
          );
        }
        return child;
      })}
    </div>
  );
};

export default NavDropdownUI;
