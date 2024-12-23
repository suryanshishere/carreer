import SavedPosts from "user/pages/account/SavedPosts";
import ChangePassword from "user/pages/account/setting/ChangePassword";
import ForgotPassword from "user/pages/auth/ForgotPassword";
import DeactivateAccount from "user/pages/account/setting/DeactivateAccount";
import ReqPublisherAccess from "user/pages/ReqPublisherAccess";
import ResetPassword from "user/pages/auth/ResetPassword";

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
          { path: "apply-for-publisher", element: <ReqPublisherAccess /> },
          {
            path: "account",
            children: [
              { path: "saved-posts", element: <SavedPosts /> },
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
