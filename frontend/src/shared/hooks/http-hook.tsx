import { useState, useCallback, useRef, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async <T extends ResponseData>(
      url: string,
      method: string = "GET",
      body: any = null,
      headers: Record<string, string> = {}
    ): Promise<HttpClientResponse<T>> => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData: T = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message || "Something went wrong");
        }

        setIsLoading(false);
        return { data: responseData, status: response.status };
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
          return Promise.reject(err);
        } else {
          setError(err.message || "Something went wrong");
          setIsLoading(false);
          throw err;
        }
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
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
