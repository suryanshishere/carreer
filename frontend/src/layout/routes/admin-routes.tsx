import Access from "admin/pages/Access";
import CreateNewPost from "user/publisher/pages/CreateNewPost";

const adminRoutes = (token: string | null, role?: string) => {
  if (!token) {
    return [];
  }

  if (role === "publisher" || role === "admin") {
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
            path: "access",
            element: <Access />,
          },
        ],
      },
    ];
  }

  return [];
};

export default adminRoutes;
