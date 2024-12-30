import React from "react";

interface NotFoundProps {
  children?: React.ReactNode;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ children, className }) => {
  // const navigate = useNavigate();
  // const [countdown, setCountdown] = useState(10);

  // useEffect(() => {
  //   if (!children) {
  //     const timer = setTimeout(() => {
  //       navigate(-1);
  //     }, 10000);

  //     const interval = setInterval(() => {
  //       setCountdown((prevCountdown) => prevCountdown - 1);
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timer);
  //       clearInterval(interval);
      // };
    // }
  // }, [navigate, children]);

  return (
    <div className={`${className} center`}>
      <p>
        {children
          ? children
          : `Page doesn't exist.`}
      </p>
    </div>
  );
};

export default NotFound;
