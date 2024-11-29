// import ACCOUNT_SETTING from "db/userDb/accountDb/setting.json";
import { ICommonMap } from "models/quick/ICommonMap";
import { Link } from "react-router-dom";

const Setting = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* {ACCOUNT_SETTING.map(
        (item: ICommonMap) =>
          item.link && (
            <Link key={item.link} to={item.link}>
              {item.header}
            </Link>
          )
      )} */}
    </div>
  );
};

export default Setting;
