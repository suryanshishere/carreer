import React from "react";

interface UIFormDataProps {
  formData: { [key: string]: string };
  className?: string;
  style?: React.CSSProperties;
}

const UIFormData: React.FC<UIFormDataProps> = ({
  formData,
  className = "",
  style,
}) => {
  return (
    <>
      {formData && Object.keys(formData).length > 0 ? (
        <div
          className={`flex flex-col flex-wrap gap-2 ${className}`}
          style={style}
        >
          {Object.entries(formData).map(([key, value]) => (
            <li className="flex items-center list-none gap-2" key={key}>
              <h6 className="self-start m-0 pt-1 capitalize">{key}:</h6>
              <p className="m-0 font-bold">
                {Array.isArray(value) ? value.join(", ") : value}
              </p>
            </li>
          ))}
        </div>
      ) : (
        "Something went wrong! Try re-submitting by refreshing the page."
      )}
    </>
  );
};

export default UIFormData;
