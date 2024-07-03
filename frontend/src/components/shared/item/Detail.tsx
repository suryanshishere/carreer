import React from "react";
import { RelatedDetailPage, TableItem } from "src/models/exam/DetailProps";
import CustomizedTables from "src/shared/components/uiElements/cover/Table";
import { formatWord } from "src/helpers/FormatWord";
import "./Detail.css";
import Filter from "src/shared/components/utils/Filter";
import { ValueHandler } from "src/shared/components/utils/Helper";

interface DetailItemProps {
  relatedDetailPage: RelatedDetailPage[];
}

const DetailItem: React.FC<DetailItemProps> = ({ relatedDetailPage }) => {
  return (
    <div className="flex gap-3">
      <div className="w-full flex flex-col gap-4">
        {relatedDetailPage.map((item, index) => (
          <div key={index} className="detail_topic flex flex-col gap-1 w-full">
            <h5 className="self-start font-bold capitalize">
              {formatWord(item.key)}:
            </h5>
            <span className="flex flex-col gap-3">
              <ValueHandler objectItem={item} />
              {item.value &&
                item.value.map((value, idx) => (
                  <React.Fragment key={idx}>
                    {typeof value === "object" &&
                      value !== null &&
                      "table" in value && (
                        <div className="flex flex-col">
                          <CustomizedTables
                            tableData={value.table as TableItem}
                          />
                        </div>
                      )}
                  </React.Fragment>
                ))}
            </span>
          </div>
        ))}
      </div>
      <Filter data={relatedDetailPage.length} />
    </div>
  );
};

export default DetailItem;
