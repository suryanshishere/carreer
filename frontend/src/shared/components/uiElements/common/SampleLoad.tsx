import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";

const SampleLoad = () => {

  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayed(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (delayed) {
    return null;
  }


  return (
    <>
      {Array(18)
        .fill(null)
        .map((_, index) => (
          <li key={index}>
            <div className="links_ul_a no-underline pb-1 pt-1">
              <Skeleton />
            </div>
            {index !== 17 && <hr />}
          </li>
        ))}
    </>
  );
};

export default SampleLoad;
