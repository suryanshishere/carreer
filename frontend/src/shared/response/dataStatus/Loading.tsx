import React, { CSSProperties, useState, useEffect, useCallback } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import useHandleScroll from "shared/hooks/sub-nav-scroll-hook";

interface LoadingProps {
  style?: CSSProperties;
  className?: string;
  loadingOnTop?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  style,
  className,
  loadingOnTop,
}) => {
  // const [delayed, setDelayed] = useState(true);
  const showSubNav = useHandleScroll();

  // not immediately starting loading if the load time got to less than 1.5sec.
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDelayed(false);
  //   }, 1500);

  //   return () => clearTimeout(timer);
  // }, []);

  // if (delayed) {
  //   return null;
  // }

  if (loadingOnTop) {
    return (
      <div
        className="fixed w-full z-0"
        style={{
          ...style,
          top: !showSubNav
            ? "calc(var(--height-main-nav) + 0.3rem)"
            : "calc(var(--height-main-nav-sec) - 1.7rem)",
        }}
      >
        <LinearProgress
          sx={{
            "& .MuiLinearProgress-bar": {
              backgroundColor: "var(--color-red)",
            },
            borderRadius: 15,
            height: 5,
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-4">
      <LinearProgress
        sx={{
          backgroundColor: "var(--color-black)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "var(--color-brown)",
          },
          borderRadius: 15,
        }}
      />
    </div>
  );
};

export default Loading;
