import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";

// Define an interface for response data
interface ResponseData {
  message: string;
  // Add any additional properties if needed
}

// Define a type for the HTTP response
interface HttpClientResponse<T> {
  data: T;
  status: number;
}

export const useHttpClient = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeHttpRequests = useRef<Map<number, AbortController>>(new Map());
  const requestCounter = useRef(0);

  useEffect(() => {
    dispatch(dataStatusUIAction.isLoadingHandler(isLoading));
  }, [isLoading, dispatch]);

  const sendRequest = useCallback(
    async <T extends ResponseData>(
      url: string,
      method: string = "GET",
      body: any = null,
      headers: Record<string, string> = {}
    ): Promise<HttpClientResponse<T>> => {
      setError(null);

      const requestId = requestCounter.current++;
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.set(requestId, httpAbortCtrl);
      
      // Set isLoading to true when starting a new request
      if (activeHttpRequests.current.size === 1) {
        setIsLoading(true);
      }

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData: T = await response.json();

        activeHttpRequests.current.delete(requestId);
        
        // Set isLoading to false if no active requests remain
        if (activeHttpRequests.current.size === 0) {
          setIsLoading(false);
        }

        if (!response.ok) {
          throw new Error(responseData.message || "Something went wrong");
        }

        //data and status is seperated
        return { data: responseData, status: response.status };
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError(err.message || "Something went wrong");
        }
        activeHttpRequests.current.delete(requestId);

        // Set isLoading to false if no active requests remain
        if (activeHttpRequests.current.size === 0) {
          setIsLoading(false);
        }

        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
      activeHttpRequests.current.clear();
      setIsLoading(false); // Ensure loading state is reset on component unmount
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
