import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "shared/store";
import { updateUserData } from "shared/store/userSlice";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import { useMutation } from "@tanstack/react-query";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";
const Footer: React.FC = () => {
  const { role, token } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const { mutate: activateAccess } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.get("/admin/get-role");
      return data;
    },
    onSuccess: ({ data: { role }, token, message }) => {
      dispatch(updateUserData({ role, token }));
      dispatch(triggerSuccessMsg(message || "Activated successfully!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to activate access!"
        )
      );
    },
  });

  const footerLinkClassName = "hover:underline large_mobile:text-start w-fit";

  return (
    <footer className="large_mobile:px-page bottom-0 min-mt-screen bg-custom_pale_yellow py-4 flex flex-col-reverse large_mobile:flex-row justify-center items-center w-full gap-4 text-base text-gray-600">
      <div className="select-none self-center text-center large_mobile:text-base text-sm">
        Copyright &copy; 2024 All Rights Reserved by <b>{LOGO}</b>
      </div>
      <hr className="large_mobile:hidden min-w-fit" />
      <div className="grid grid-cols-2 gap-x-3 text-sm text-custom_red text-center">
        <Link to="/about" className={footerLinkClassName}>
          About
        </Link>
        <Link to="/contact-us" className={footerLinkClassName}>
          Contact Us
        </Link>
        {token && (
          <Link to="/user/req-access" className={footerLinkClassName}>
            Request Access
          </Link>
        )}
        {token && role === "none" ? (
          <button
            onClick={() => activateAccess()}
            className={footerLinkClassName}
          >
            Activate access
          </button>
        ) : (
          <button
            onClick={() => dispatch(updateUserData({ role: "none" }))}
            className={footerLinkClassName}
          >
            Deactivate access
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
