import SavedPosts from "user/user-pages/account/SavedPosts";
import ChangePassword from "user/user-pages/account/setting/ChangePassword";
import ForgotPassword from "user/user-pages/auth/ForgotPassword";
import DeactivateAccount from "user/user-pages/account/setting/DeactivateAccount";
import ReqAccess from "user/user-pages/RequestAccess";
import ResetPassword from "user/user-pages/auth/ResetPassword";
import MyContribution from "user/user-pages/account/MyContribution";

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
