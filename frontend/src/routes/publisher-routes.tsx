import CreateNewPost from "user/publisher/pages/CreateNewPost";

const publisherRoutes = (token: string | null, role?: string) => {
  return token && role === "publisher"
    ? [
        {
          path: "publisher",
          children: [{ path: "create-new-post", element: <CreateNewPost /> }],
        },
      ]
    : [];
};

export default publisherRoutes;
