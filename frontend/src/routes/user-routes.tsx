import SavedPosts from "users/pages/account/SavedPosts";
import ChangePassword from "users/pages/account/setting/ChangePassword";
import ForgotPassword from "users/pages/auth/ForgotPassword";
import DeactivateAccount from "users/pages/account/setting/DeactivateAccount";
import ReqAccess from "users/pages/RequestAccess";
import ResetPassword from "users/pages/auth/ResetPassword";
import MyContribution from "users/pages/account/MyContribution";

const userRoutes = (token: string | null, role?: string) => {
  if (token) {
    return [
      {
        path: "user",
        children: [
          {
            path: "reset_password/:resetPasswordToken",
            element: <ResetPassword />,
          },
          { path: "req-access", element: <ReqAccess /> },
          {
            path: "account",
            children: [
              { path: "saved-posts", element: <SavedPosts /> },
              { path: "my-contribution" , element: <MyContribution/>},
              {
                path: "setting",
                children: [
                  // {
                  //   index: true,
                  //   element: <Setting />,
                  // },
                  {
                    path: "change-password",
                    element: <ChangePassword />,
                  },
                  {
                    path: "forgot-password",
                    element: <ForgotPassword />,
                  },
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

  return [];
};

export default userRoutes;
