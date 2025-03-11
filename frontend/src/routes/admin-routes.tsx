import Access from "admin/pages/Access";
import CreateNewPost from "admin/pages/CreateNewPost";
import { IRole } from "admin/admin-db";
import ContriSec from "admin/pages/approver/ContributionSection";  
import ContributionApprove from "admin/pages/approver/ContributionApprove";

const adminRoutes = (token: string | null, role?: IRole) => {
  if (!token) return [];

  // Helper function to check if the user has a specific role
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
            { path: ":section/:postCode", element: <ContributionApprove /> },
            // { path: ":section", element: <ContriTrends /> },
          ],
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

export default adminRoutes;
