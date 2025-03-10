import React, { useState, useEffect } from "react";
import { SquareUI } from "shared/ui";
import LoadingDocIcon from "shared/assets/loadingDocIcon.gif";

interface DataStateWrapperProps<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  emptyCondition: (data: T) => boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: (data: T | null) => React.ReactNode;
  skipLoadingUI?: boolean;
}

const DefaultLoadingComponent = () => (
  <div className="w-full flex flex-col gap-1 items-center my-12 justify-center">
    <img
      src={LoadingDocIcon}
      alt="Loading Doc Icon"
      className="w-22 h-20 object-cover"
    />
    <span className="pl-1 text-xs text-custom_less_gray font-bold">
      LOADING...
    </span>
  </div>
);

const DefaultErrorComponent = () => (
  <ul className="text-custom_red font-semibold">
    <li className="flex gap-2 items-center">
      <SquareUI /> No Data / Nothing to show.
    </li>
    <li className="flex gap-2 items-center">
      <SquareUI /> Or something went wrong, please try again later.
    </li>
  </ul>
);

const DataStateWrapper = <T,>({
  isLoading,
  error,
  data,
  emptyCondition,
  loadingComponent = <DefaultLoadingComponent />,
  errorComponent = <DefaultErrorComponent />,
  emptyComponent = <DefaultErrorComponent />,
  children,
  skipLoadingUI = false,
}: DataStateWrapperProps<T>) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isLoading) {
      timer = setTimeout(() => setShowLoading(true), 2000);
    } else {
      setShowLoading(false);
      if (timer) clearTimeout(timer);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  if (error) return <>{errorComponent}</>;

  if (isLoading) {
    if (skipLoadingUI) {
      return <>{children(data)}</>;
    }
    return showLoading ? <>{loadingComponent}</> : null;
  }

  if (!data || emptyCondition(data)) return <>{emptyComponent}</>;

  return <>{children(data)}</>;
};

export default DataStateWrapper;
