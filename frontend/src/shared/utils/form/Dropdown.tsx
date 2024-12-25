import React, { CSSProperties, forwardRef } from "react";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { startCase } from "lodash";

interface IDropdown {
  name: string;
  data: string[] | IPostAdminData[];
  required?: boolean;
  multiple?: boolean;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  error?: boolean;
  helperText?: string;
  register?: any; // Register from React Hook Form
  errorClassProp?: string;
  classProp?: string;
  style?: CSSProperties;
}

const Dropdown = forwardRef<HTMLSelectElement, IDropdown>(
  (
    {
      data,
      label,
      name,
      helperText,
      error,
      style,
      errorClassProp,
      classProp,
      onChange,
      required,
      multiple,register
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {startCase(label)}
          </label>
        )}
        <select
          id={name}
          name={name}
          ref={ref} 
          onChange={onChange}
          {...register?.(name)}
          required={required}
          multiple={multiple}
          className={`w-full pl-2 py-2 outline outline-2 outline-custom-less-gray text-base rounded ${classProp} ${
            error ? "outline-custom-red" : ""
          } ${error ? "focus:ring-custom-red" : "focus:ring-custom-less-gray"}`}
          style={style}
        >
            <option value="" disabled hidden>
    Select an option
  </option>
          {data.map((item) =>
            typeof item === "string" ? (
              <option key={item} value={item}>
                {startCase(item)}
              </option>
            ) : (
              <option key={item._id} value={item._id}>
                {startCase(item.name_of_the_post)}
              </option>
            )
          )}
        </select>
        {helperText && (
          <p
            className={`ml-2 mt-[2px] bg-custom-white text-xs w-auto whitespace-nowrap ${
              error ? "text-custom-red" : "text-grey"
            } ${errorClassProp}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

export default Dropdown