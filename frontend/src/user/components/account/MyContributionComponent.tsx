import React from "react";
import { IContributionDetails } from "user/pages/account/MyContribution";
import { Link } from "react-router-dom";
import { startCase } from "lodash";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import Button from "shared/utils/form/Button";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";

const MyContributionComponent: React.FC<{ data: IContributionDetails }> = ({
  data,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  //sending postcode, section, user id through token and now make the update by deleting the data.
  const deleteContributeMutation = useMutation({
    mutationFn: async (data: { post_code: string; section: string }) => {
      const response = await axiosInstance.patch("/user/account/post/delete-contribution", data);
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Contribution deleted!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Contribution deletion failed!"
        )
      );
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(data).map(([postCode, value], index) => (
        <div key={postCode} className="flex flex-col gap-2">
          <h2 className="whitespace-nowrap">{startCase(postCode)}</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(value).map(([section, subValue]) => (
              <div key={section} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 justify-center">
                    <h2 className="pl-0">{startCase(section)}</h2>
                    <Link
                      to={`/sections/${section}/${postCode.toLowerCase()}`}
                      className="text-custom-red hover:text-custom-blue flex items-center justify-center p-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewOutlinedIcon fontSize="small" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button iconButton>
                      <EditSharpIcon fontSize="small" />
                    </Button>
                    <span className="bg-custom-less-gray text-custom-white rounded-full px-3">
                      Pending
                    </span>
                    <Button
                      iconButton
                      onClick={() =>
                        deleteContributeMutation.mutate({
                          post_code: postCode,
                          section: section,
                        })
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </Button>
                  </div>
                </div>
                {typeof subValue === "object" && !Array.isArray(subValue) ? (
                  Object.entries(subValue as IContributionDetails).map(
                    ([detailKey, detailValue], index) => (
                      <React.Fragment key={`${section}-${detailKey}`}>
                        <ul className="pl-1 grid grid-cols-[1rem,1fr]">
                          <div className="w-2 h-2 mt-2 bg-custom-gray rounded-sm"></div>
                          <li className="flex flex-col mb-2">
                            <span className="text-sm font-semibold text-custom-gray">
                              {detailKey.replace(/\./g, " / ")}:
                            </span>
                            <span> {detailValue.toString()}</span>
                          </li>
                        </ul>
                      </React.Fragment>
                    )
                  )
                ) : (
                  <p>{subValue ? subValue.toString() : ""}</p>
                )}
              </div>
            ))}
          </div>
          {Object.keys(data).length - 1 !== index && (
            <hr className="col-span-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MyContributionComponent;
