import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Access from "admin/pages/Access";
import CreateNewPost from "admin/pages/CreateNewPost";
import { IRole } from "admin/db";
import ContriSec from "admin/pages/approver/ContributeSection";
import ContributionApprove from "admin/pages/approver/ContributeApprove";
import NonApprovedPosts from "admin/pages/approver/NonApprovedPosts";

export const useAdminRoutes = () => {
  const role = useSelector((state: RootState) => state.user.userData.role);

  // Helper function to check if the user has one of the required roles
  const hasAccess = (roles: IRole[]) => role && roles.includes(role);

  const routes = [];

  if (hasAccess(["approver", "admin"])) {
    routes.push({
      path: "approver",
      children: [
        {
          path: "contributions-section/:section?",
          children: [
            { index: true, element: <ContriSec /> },
            {
              path: ":section/:postCode/:version",
              element: <ContributionApprove />,
            },
          ],
        },
        {
          path: "non-approved-posts/:section?",
          element: <NonApprovedPosts />,
        },
      ],
    });
  }

  if (hasAccess(["publisher", "admin"])) {
    routes.push({
      path: "publisher",
      children: [{ path: "create-new-post", element: <CreateNewPost /> }],
    });
  }

  if (hasAccess(["admin"])) {
    routes.push({
      path: "admin",
      children: [{ path: "access", element: <Access /> }],
    });
  }

  return routes;
};
