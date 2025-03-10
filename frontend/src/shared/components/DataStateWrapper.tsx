import React from "react";
import { SquareUI } from "shared/ui";

interface DataStateWrapperProps<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  // Function to determine if data is "empty" (e.g., based on object keys, array length, etc.)
  emptyCondition: (data: T) => boolean;
  // Optional components to override defaults
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  // Render prop to render the actual UI when data is available
  children: (data: T | null) => React.ReactNode;
  // If true, bypass the default loading UI and render children directly when loading,
  // but once loading is finished, the empty condition will still be checked.
  skipLoadingUI?: boolean;
}

const DataStateWrapper = <T,>({
  isLoading,
  error,
  data,
  emptyCondition,
  loadingComponent = (
    <div className="text-center text-gray-500">Loading...</div>
  ),
  errorComponent = (
    <ul className="text-custom_red font-semibold">
      <li className="flex gap-2 items-center">
        <SquareUI /> No Data / Nothing to show.
      </li>
      <li className="flex gap-2 items-center">
        <SquareUI /> Or something went wrong, please try again later.
      </li>
    </ul>
  ),
  emptyComponent = (
    <ul className="text-custom_red font-semibold">
      <li className="flex gap-2 items-center">
        <SquareUI /> No Data / Nothing to show.
      </li>
      <li className="flex gap-2 items-center">
        <SquareUI /> Or something went wrong, please try again later.
      </li>
    </ul>
  ),
  children,
  skipLoadingUI = false,
}: DataStateWrapperProps<T>) => {
  if (error) return <>{errorComponent}</>;

  if (isLoading) {
    if (skipLoadingUI) {
      // While loading, render children (skeleton or placeholder managed internally)
      return <>{children(data)}</>;
    }
    return <>{loadingComponent}</>;
  }

  // Once loading is complete, check if data is empty.
  if (!data || emptyCondition(data)) return <>{emptyComponent}</>;

  return <>{children(data)}</>;
};

export default DataStateWrapper;
