import React, { ReactNode  } from "react";
import { Skeleton } from "@mui/material";
import "./Filter.css";

interface BannerProps {
  className?: string;
  children?: ReactNode;
  data: number ;
  noAnimation?: boolean;
}

const Filter: React.FC<BannerProps> = ({
  children,
  className,
  data,
  noAnimation,
}) => {
  // const [delayed, setDelayed] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDelayed(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  // if (delayed) {
  //   return null;
  // }

  if (data === 0) {
    return (
      <div className="items-end w-1/3 h-80">
        {noAnimation ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="30rem"
            sx={{ borderRadius: "var(--border-radius)" }}
            animation={false}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="30rem"
            sx={{ borderRadius: "var(--border-radius)" }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className=" items-end w-1/3"
      style={{
        height: "30rem",
        border: "3px solid var(--hover-faint-color)",
        borderRadius: "var(--border-radius-more)",
      }}
    ></div>
  );
};

export default Filter;
