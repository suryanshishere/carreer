import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import SavedPosts from "users/pages/account/SavedPosts";
import ChangePassword from "users/pages/account/setting/ChangePassword";
import ForgotPassword from "users/pages/auth/ForgotPassword";
import DeactivateAccount from "users/pages/account/setting/DeactivateAccount";
import ReqAccess from "users/pages/RequestAccess";
import ResetPassword from "users/pages/auth/ResetPassword";
import MyContribution from "users/pages/account/MyContribution";

export const useUserRoutes = () => {
  const token = useSelector((state: RootState) => state.user.token);
  if (token) {
    return [
      {
        path: "user",
        children: [
          // {
          //   path: "reset-password/:resetPasswordToken",
          //   element: <ResetPassword />,
          // },
          { path: "req-access", element: <ReqAccess /> },
          {
            path: "account",
            children: [
              { path: "saved-posts", element: <SavedPosts /> },
              { path: "my-contribution", element: <MyContribution /> },
              {
                path: "setting",
                children: [
                  { path: "change-password", element: <ChangePassword /> },
                  { path: "forgot-password", element: <ForgotPassword /> },
                  {
                    path: "deactivate-account",
                    element: <DeactivateAccount />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }
  return [
    {
      path: "user/reset-password/:resetPasswordToken",
      element: <ResetPassword />,
    },
  ];
};
