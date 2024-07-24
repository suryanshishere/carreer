import React, { CSSProperties, useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

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
  const [delayed, setDelayed] = useState(true);

  // not immediately starting loading if the load time got to less than 1.5sec.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayed(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (delayed) {
    return null;
  }

  if (loadingOnTop) {
    return (
      <div
        className="w-full z-50"
        // style={{ ...style, top: "var(--height-main-nav)" }}
      >
        <LinearProgress
          sx={{
            backgroundColor: "var(--color-black)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "var(--color-brown)",
            },
            borderRadius: 15,
            height: 3,
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
