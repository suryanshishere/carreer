import PublisherAccess from "admin/pages/Access";
import CreateNewPost from "user/publisher/pages/CreateNewPost";

const adminRoutes = (token: string | null, role?: string) => {
  if (!token) {
    return [];
  }

  if (role === "publisher") {
    return [
      {
        path: "publisher",
        children: [{ path: "create-new-post", element: <CreateNewPost /> }],
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        path: "admin",
        children: [
          {
            path: "publisher-access",
            element: <PublisherAccess />,
          },
        ],
      },
    ];
  }

  return [];
};

export default adminRoutes;
