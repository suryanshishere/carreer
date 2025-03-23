import ADMIN_DB, { IStatus } from "admin/db";
import React from "react";
import Button from "shared/utils/form/Button";

interface ContributionItemProps {
  item: Record<string, any>;
  applying: Record<string, boolean>;
  applyMutation: (data: {
    id: string;
    key: string;
    value: any;
    status: IStatus;
  }) => void;
}

const { status, status_classname } = ADMIN_DB;

const ContributeApproveItem: React.FC<ContributionItemProps> = ({
  item,
  applying,
  applyMutation,
}) => {
  return (
    <article>
      <header className="mb-2">
        <h2 className="font-bold">Contribution ID: {item._id}</h2>
      </header>

      <dl className="flex flex-col gap-3">
        {Object.entries(item)
          .filter(([key]) => key !== "_id")
          .map(([key, value]) => {
            const isPending = applying[`${item._id}-${key}`];
            return (
              <div key={key} className="flex flex-col gap-2">
                <dt className="font-bold">{key.replace(/\./g, " / ")}</dt>
                <div className="flex flex-col mobile:flex-row mobile:items-center gap-3">
                  <p>{value as React.ReactNode}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        applyMutation({
                          id: item._id,
                          key,
                          value,
                          status: "rejected",
                        })
                      }
                      disabled={isPending}
                      className={`py-1 px-4 font-semibold text-xs ${status_classname.rejected}`}
                    >
                      {isPending ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      onClick={() =>
                        applyMutation({
                          id: item._id,
                          key,
                          value,
                          status: "approved",
                        })
                      }
                      disabled={isPending}
                      className={`py-1 px-4 font-semibold text-xs ${status_classname.approved}`}
                    >
                      {isPending ? "Approving..." : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </dl>
    </article>
  );
};

export default ContributeApproveItem;
