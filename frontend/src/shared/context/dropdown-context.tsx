import React, { createContext, FC, useState } from "react";

interface IDropdownContext {
  onErrorMsg: string | null;
  onSuccessMsg: string | null;
  isLoading: boolean;
  setErrorMsg: (val: string, timeout?: number) => void;
  setSuccessMsg: (val: string, timeout?: number) => void;
  setIsLoading: (val: boolean) => void;
}

// Create context with default values
export const DropdownContext = createContext<IDropdownContext>({
  onErrorMsg: null,
  onSuccessMsg: null,
  isLoading: false,
  setErrorMsg: () => {},
  setSuccessMsg: () => {},
  setIsLoading: () => {},
});

interface ResponseContextProviderProps {
  children: React.ReactNode;
}

export const DropdownContextProvider: FC<ResponseContextProviderProps> = ({
  children,
}) => {
  const [onErrorMsg, setOnErrorMsg] = useState<string | null>(null);
  const [onSuccessMsg, setOnSuccessMsg] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  // Timeout references to clear on each message update
  let errorTimeout: NodeJS.Timeout;
  let successTimeout: NodeJS.Timeout;

  // Define handlers for updating context state with optional timeout
  const setErrorMsg = (val: string, timeoutInSeconds: number = 3) => {
    clearTimeout(errorTimeout); // Clear any existing timeout
  
    setOnErrorMsg(val);
    errorTimeout = setTimeout(() => {
      setOnErrorMsg(null);
    }, timeoutInSeconds * 1000); // Convert seconds to milliseconds
  };

  const setSuccessMsg = (val: string, timeoutInSeconds: number = 3) => {
    clearTimeout(successTimeout); // Clear any existing timeout

    setOnSuccessMsg(val);
    successTimeout = setTimeout(() => {
      setOnSuccessMsg(null);
    }, timeoutInSeconds * 1000);
  };

  const setIsLoading = (val: boolean) => {
    setLoading(val);
  };

  // Value passed to context consumers
  const contextValue: IDropdownContext = {
    onErrorMsg,
    onSuccessMsg,
    isLoading,
    setErrorMsg,
    setSuccessMsg,
    setIsLoading,
  };

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  );
};
