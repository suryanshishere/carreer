import React, { CSSProperties, forwardRef } from "react";
import { IPostAdminData } from "admin/db";
import { startCase } from "lodash";

interface IDropdown {
  name: string;
  data: string[] | IPostAdminData[];
  required?: boolean;
  multiple?: boolean;
  label?: string | boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: boolean;
  helperText?: string;
  register?: any; // Register from React Hook Form
  errorClassProp?: string;
  classProp?: string;
  style?: CSSProperties;
  defaultValue?: string | number | Date;
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
      multiple,
      register,
      defaultValue,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {typeof label === "string" ? startCase(label) : startCase(name)}
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
          defaultValue={defaultValue}
          className={`w-full p-2 outline outline-2 outline-custom_less_gray text-base rounded ${classProp} ${
            error ? "outline-custom_red" : ""
          } ${error ? "focus:ring-custom_red" : "focus:ring-custom_less_gray"}`}
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
            className={`ml-2 mt-[2px] text-xs w-auto ${
              error ? "text-custom_red" : "text-grey"
            } ${errorClassProp}`}
          >
            {helperText.replace(/_/g, " ")}
          </p>
        )}
      </div>
    );
  }
);

export default Dropdown;
