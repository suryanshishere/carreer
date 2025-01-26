import { Link } from "react-router-dom";
import { startCase } from "lodash";
import  POST_DB  from "db/post-env-db";

const ContriSec = () => {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {POST_DB.sections.map((item: string) => (
        <Link
          to={item}
          key={item}
          className="h-[10rem] min-w-[12rem] bg-custom-pale-yellow hover:bg-custom-pale-orange flex items-center justify-center"
        >
          {startCase(item)}
        </Link>
      ))}
    </ul>
  );
};

export default ContriSec;
