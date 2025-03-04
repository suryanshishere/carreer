import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import store, { AppDispatch, RootState } from "shared/store";
import { logout, handleAccountDeactivatedAt } from "shared/store/user_slice";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import Button from "shared/utils/form/Button";

const ActivateAccount = () => {
  const { deactivatedAt, token } = useSelector(
    (state: RootState) => state.user.userData
  );
  const dispatch = useDispatch<AppDispatch>();

  // Calculate inactive days
  const inactiveDays = deactivatedAt
    ? Math.floor(
        (new Date().getTime() - new Date(deactivatedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const activateMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `/user/account/activate-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      // dispatch(handleAccountDeactivatedAt(undefined));
      dispatch(triggerSuccessMsg(message));
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
    retry: 3,
  });

  return (
    <div className="w-full grid grid-cols-[85%_15%] items-center">
      <div className="h-5/6 w-full flex gap-6 items-center">
        <p className="w-2/3">
          Your account was deactivated earlier, and was being inactive for{" "}
          {inactiveDays + " "}
          days. <b>Do you like to activate your account?</b>
        </p>

        <Button
          onClick={() => activateMutation.mutate()}
          authButtonType
          classProp={`flex-1 ${
            activateMutation.isPending ? "bg-custom_black" : "bg-custom_gray"
          }`}
        >
          {activateMutation.isPending
            ? "Activating your account.."
            : "Activate"}
        </Button>
      </div>
      <div className="pl-8 flex flex-col gap-[3px] items-start">
        <Link
          to="/contact-us"
          className="hover:text-custom_less_red p-0 m-0 text-xs"
        >
          Need help?
        </Link>
        <button
          className="hover:text-custom_less_red p-0 m-0 ml-auto text-xs"
          onClick={() => store.dispatch(logout())}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ActivateAccount;
