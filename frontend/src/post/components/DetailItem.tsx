import React from "react";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { IPostDetail } from "models/post/IPostDetail";
import Table from "shared/uiComponents/dataVisualization/Table";
import "./DetailItem.css";

interface DetailItemProps {
  detailPageData: IPostDetail;
  editMode?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  detailPageData,
  editMode,
}) => {
  const renderValue = (value: any, key?: string) => {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      value instanceof Date
    ) {
      return <p key={key}>{value.toString()}</p>;
    } else if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        value.every((item) => typeof item === "object" && item !== null)
      ) {
        return (
          <div key={key}>
            <Table tableArray={value} />
          </div>
        );
      } else {
        return (
          <div key={key}>
            {value.map((item, index) => (
              <p key={index}>{item.toString()}</p>
            ))}
          </div>
        );
      }
    } else if (typeof value === "object" && value !== null) {
      return (
        <div key={key}>
          <Table tableObject={value} />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="flex gap-3">
      <div className="w-full flex flex-col gap-4">
        {Object.entries(detailPageData).map(([key, value], index) => (
          <div key={index} className="detail_topic flex flex-col gap-1 w-full">
            <h5 className="self-start font-bold capitalize">
              {formatWord(key)}
            </h5>
            <div className="flex flex-col gap-3">
              <div>{renderValue(value)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailItem;
