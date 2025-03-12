import React from "react";
import Button from "shared/utils/form/Button";

interface ContributionItemProps {
  item: Record<string, any>;
  applying: Record<string, boolean>;
  applyMutation: any;
}

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
              <div key={key} className="flex flex-col">
                <dt className="font-bold">{key.replace(/\./g, " / ")}</dt>
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:items-start gap-3">
                  <p>{value as React.ReactNode}</p>
                  <Button
                    onClick={() =>
                      applyMutation.mutate({
                        id: item._id,
                        key,
                        value,
                      })
                    }
                    disabled={isPending}
                    classProp="py-1 px-4 font-semibold text-xs"
                  >
                    {isPending ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </div>
            );
          })}
      </dl>
    </article>
  );
};

export default ContributeApproveItem;
