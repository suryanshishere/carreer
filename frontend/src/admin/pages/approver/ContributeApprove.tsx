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
import { startCase } from "lodash";
import PageHeader from "shared/ui/PageHeader";
import DataStateWrapper from "shared/utils/DataStateWrapper"; 
import ContributeApproveItem from "admin/components/ContributeApproveItem";

const ContributionApprove = () => {
  const { section, postCode, version } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [applying, setApplying] = useState<{ [key: string]: boolean }>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["contri", section, postCode, version],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${section}/${postCode}/${version}`
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
        {
          contributor_id: id,
          data: { [key]: value },
          post_code: postCode,
          version,
          section,
        }
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
        <DataStateWrapper
          isLoading={isLoading}
          error={error}
          data={data?.data || []}
          emptyCondition={(data) => data.length === 0}
        >
          {(contriData) =>
            contriData?.map((item: any, index: number) => (
              <React.Fragment key={item._id}>
                <ContributeApproveItem
                  item={item}
                  applying={applying}
                  applyMutation={applyMutation}
                />
                {contriData.length - 1 !== index && <hr />}
              </React.Fragment>
            ))
          }
        </DataStateWrapper>
      </section>
    </main>
  );
};

export default ContributionApprove;
