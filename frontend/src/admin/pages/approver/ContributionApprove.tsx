import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import Button from "shared/utils/form/Button";
import { startCase } from "lodash";
import PageHeader from "shared/ui/PageHeader";

const ContributionApprove = () => {
  const { section, postCode, version } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [applying, setApplying] = useState<{ [key: string]: boolean }>({});

  const {
    data = { data: [], POST_DB: {} },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contri"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${section}/${
          postCode + "_1_" + version
        }`
      );
      return response.data;
    },
    retry: 3,
  });

  const applyMutation = useMutation({
    mutationFn: async ({
      id,
      key,
      value,
    }: {
      id: string;
      key: string;
      value: any;
    }) => {
      setApplying((prev) => ({ ...prev, [`${id}-${key}`]: true }));
      const response = await axiosInstance.post(
        "/admin/approver/apply-contri",
        JSON.stringify({
          contributor_id: id,
          data: { [key]: value },
          post_code: postCode,
          version,
          section,
        })
      );
      return response.data;
    },
    onSuccess: ({ message }, { id, key }) => {
      dispatch(
        triggerSuccessMsg(message || "Applying contribution successful!")
      );
      setApplying((prev) => ({ ...prev, [`${id}-${key}`]: false }));
    },
    onError: (error: any, { id, key }) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Applying contribution failed!"
        )
      );
      setApplying((prev) => ({ ...prev, [`${id}-${key}`]: false }));
    },
  });

  return (
    <main>
      <PageHeader
        header={`${postCode} / ${version}`}
        subHeader={`${startCase(section)} (Contribution Approval)`}
      />
      <section
        aria-label="Contribution Approvals"
        className="flex flex-col gap-3"
      >
        {isLoading && <p>Loading contributions...</p>}
        {error && <p>Error loading contributions.</p>}
        {!isLoading && data.data.length === 0 && <p>No contributions found.</p>}
        {data.data.map((item: any, index: number) => (
          <React.Fragment key={item._id}>
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
                        <dt className="font-bold">
                          {key.replace(/\./g, " / ")}
                        </dt>
                        <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:items-start gap-3">
                          <p>{value as React.ReactNode}</p>
                          <Button
                            onClick={() =>
                              applyMutation.mutate({ id: item._id, key, value })
                            }
                            disabled={isPending}
                          >
                            {isPending ? "Applying..." : "Apply"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </dl>
            </article>
            {data.data.length - 1 !== index && <hr />}
          </React.Fragment>
        ))}
      </section>
    </main>
  );
};

export default ContributionApprove;
