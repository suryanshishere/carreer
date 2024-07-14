import React from "react";
import { RelatedDetailPage } from "models/exam/DetailProps";
import { formatWord } from "shared/utils/FormatWord";
import "./Detail.css";
import Table from "shared/components/dataVisualization/Table";

interface DetailItemProps {
  relatedDetailPage: RelatedDetailPage;
}

const DetailItem: React.FC<DetailItemProps> = ({ relatedDetailPage }) => {

  const renderValue = (value: any, key?: string) => {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      value instanceof Date
    ) {
      return <p key={key}>{value.toString()}</p>;
    } else if (Array.isArray(value)) {
      // Check if it's an array of objects
      if (value.every(item => typeof item === "object" && item !== null)) {
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
        {Object.entries(relatedDetailPage).map(([key, value], index) => (
          <div key={index} className="detail_topic flex flex-col gap-1 w-full">
            <h5 className="self-start font-bold capitalize">
              {formatWord(key)}
            </h5>
            <div className="flex flex-col gap-3">
              {value.map((item: any, itemIndex: number) => (
                <div key={itemIndex}>{renderValue(item)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailItem;
