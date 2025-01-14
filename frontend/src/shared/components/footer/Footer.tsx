import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "shared/store";
import { updateUserData } from "shared/store/auth-slice";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import { useMutation } from "@tanstack/react-query";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";
const Footer: React.FC = () => {
  const { role, token } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const dispatch = useDispatch<AppDispatch>();

  const { mutate: activateAccess } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.get("/admin/get-role");
      return data;
    },
    onSuccess: ({ data: { role }, message }) => {
      dispatch(updateUserData({ role }));
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

  const footerLinkClassName = "hover:underline text-start";

  return (
    <footer className="bottom-0 min-mt-screen bg-custom-pale-yellow py-4 flex flex-col lg:flex-row justify-center items-center w-full gap-4 text-base text-gray-600">
      <div className="select-none self-center">
        Copyright &copy; 2024 All Rights Reserved by <b>{LOGO}</b>
      </div>
      <div className="grid grid-cols-2 gap-x-2 text-sm text-custom-red">
        <Link to="/about" className={footerLinkClassName}>
          About
        </Link>
        <Link to="/contact-us" className={footerLinkClassName}>
          Contact Us
        </Link>
        {token && (
          <Link to="/user/apply-for-publisher" className={footerLinkClassName}>
            Request Access
          </Link>
        )}
        {token && !role && (
          <button
            onClick={() => activateAccess()}
            className={footerLinkClassName}
          >
            Activate access
          </button>
        )}
        {token && (
          <button
            onClick={() => activateAccess()}
            className={footerLinkClassName}
          >
            Revoke access (TODO)
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
