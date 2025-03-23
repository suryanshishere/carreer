import React from "react";
import { startCase } from "lodash";
import moment from "moment";
import ADMIN_DB, { IStatus } from "admin/db";

const { status, status_classname } = ADMIN_DB;

interface IAccess {
  _id: string;
  user: { email: string };
  status: string;
  reason: string;
  updatedAt: string;
  role_applied: string;
}

interface AccessItemProps {
  data: IAccess[];
  onUpdateAccess: (access: { req_id: string; role_applied: string; status: IStatus }) => void;
}

const AccessItem: React.FC<AccessItemProps> = ({ data, onUpdateAccess }) => {
  return (
    <ul className="flex flex-col gap-2">
      {data?.map(
        (
          publisher: {
            _id: string;
            user: { email: string };
            status: string;
            reason: string;
            updatedAt: string;
            role_applied: string;
          },
          index: number
        ) => (
          <React.Fragment key={publisher._id}>
            <li>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <h2 className="self-start">{publisher.user.email}</h2>
                  <div className="text-sm font-semibold flex gap-1 items-center">
                    <span className="text-xs px-2 bg-custom_less_gray rounded-full">
                      {startCase(publisher.status)}
                    </span>
                    <span className="text-xs px-2 bg-custom_less_gray rounded-full">
                      {startCase(publisher.role_applied)}
                    </span>
                    {moment(publisher.updatedAt).format("LL")}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 mb-2 items-center">
                  {status.map(
                    (item: string) =>
                      item !== publisher.status && (
                        <button
                          key={item}
                          onClick={() =>
                            onUpdateAccess({
                              req_id: publisher._id,
                              role_applied: publisher.role_applied,
                              status: item as IStatus,
                            })
                          }
                          className={`text-sm py-[2px] ${status_classname[item]}`}
                        >
                          {startCase(item)}
                        </button>
                      )
                  )}
                </div>
              </div>
              <p className="text-sm">{publisher.reason}</p>
            </li>
            {index !== data.length - 1 && <hr />}
          </React.Fragment>
        )
      )}
    </ul>
  );
};

export default AccessItem;
