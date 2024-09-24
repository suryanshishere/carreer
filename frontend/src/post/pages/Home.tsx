import React from "react";
import HomeListItem from "post/components/HomeList";
import { useHomePostListData } from "db/postDb/post-db-hook";
import "./Home.css";

const Home: React.FC = () => {
  const data = useHomePostListData();

  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.keys(data).map((key) => (
        <HomeListItem
          key={key}
          ListItemData={data[key] || []}
          category={key}
          height={
            key === "result" || key === "admit_card" || key === "latest_job"
              ? "55rem"
              : "30rem"
          }
        />
      ))}
    </div>
  );
};

export default Home;
