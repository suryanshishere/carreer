import React from "react";
import { startCase } from "lodash";
import { ILatestJob } from "models/postModels/sectionInterfaces/ILatestJob";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import moment from "moment";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";

interface DetailItemProps {
  data: ILatestJob | {};
}

const excludedKeys = [
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
  "contributors",
];

const renderValue = (value: any, key: string) => {

  if (
    (key === "important_links" || key==="common" ||
      key === "application_fee" ||
      key === "important_dates") &&
    value &&
    typeof value === "object"
  ) {

    // const filteredEntries = Object.entries(value).filter(
    //   ([subKey]) => subKey !== "_id"
    // );
    return (
      <td colSpan={2} className="border border-gray-300 px-2 py-1">
        <table className="w-full">
          <tbody>
            {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
              ([subKey, subValue]) => (
                <tr key={subKey}>
                  <td className="border border-gray-300 px-2 py-1">
                    {startCase(subKey)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {typeof subValue === "string" ? (
                      <a
                        href={subValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {subValue}
                      </a>
                    )  : typeof subValue === "number" ? (
                      <p>{subValue.toString()}</p>
                    ): subValue?.current_year != null ? (
                      <p>
                        {moment(subValue.current_year).isValid()
                          ? moment(subValue.current_year).format("Do MMMM YYYY")
                          : subValue.current_year}
                      </p>
                    ) : (
                      renderValue(subValue, "important_links")
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </td>
    );
  }

  // if (value && typeof value === "object") {
  //   return (
  //     <div>
  //       {Object.entries(value).map(([subKey, subValue]) => (
  //         <div key={subKey} className="flex flex-col gap-1">
  //           <div>{subKey}</div>
  //           <div>
  //             {subValue && typeof subValue === "object"
  //               ? renderValue(subValue, subKey)
  //               : subValue?.toString() || "-"}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  // if (excludedKeys.includes(key)) return null;

  // Handle string and number values
  // if ((value && typeof value === "string") || typeof value === "number") {
  //   return moment(value).isValid()
  //     ? moment(value).format("Do MMMM YYYY")
  //     : value.toString();
  // }

  // if (
  //   Array.isArray(value) &&
  //   value.length > 0 &&
  //   typeof value[0] === "object"
  // ) {
  //   // Get column headers from the first object keys
  //   const headers = Object.keys(value[0]).filter(
  //     (header) => !excludedKeys.includes(header)
  //   );

  //   return (
  //     <table className="border-collapse border border-gray-300 w-full">
  //       <thead>
  //         <tr>
  //           {headers.map((header) => (
  //             <th key={header} className="border border-gray-300 px-2 py-1">
  //               {startCase(header)}
  //             </th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {value.map((item, rowIndex) => (
  //           <tr key={rowIndex}>
  //             {headers.map((header) => (
  //               <td key={header} className="border border-gray-300 px-2 py-1">
  //                 {typeof item[header] === "string" ? (
  //                   <a
  //                     href={item[header]}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                     className="text-blue-500 underline"
  //                   >
  //                     {item[header]}
  //                   </a>
  //                 ) : moment(item[header]).isValid() ? (
  //                   moment(item[header]).format("Do MMMM YYYY")
  //                 ) : (
  //                   item[header]?.toString() || "-"
  //                 )}
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // }
  // if ( value && typeof value === "object") {
  //   const filteredEntries = Object.entries(value).filter(
  //     ([subKey]) => !excludedKeys.includes(subKey)
  //   );
  //     return (
  //       <div>
  //         {filteredEntries.map(
  //           ([subKey, subValue]) => (
  //             <tr key={subKey}>
  //               <td className="border border-gray-300 px-2 py-1">
  //                 {startCase(subKey)}
  //               </td>
  //               <td className="border border-gray-300 px-2 py-1">
  //                 {typeof subValue === "string" ? (
  //                   <a
  //                     href={subValue}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                     className="text-blue-500 underline"
  //                   >
  //                     {subValue}
  //                   </a>
  //                 ) : typeof subValue === "number" ? (
  //                   <p>{subValue.toString()}</p>
  //                 ) : (
  //                   renderValue(subValue, subKey)
  //                 )}
  //               </td>
  //             </tr>
  //           )
  //         )}
  //       </div>
  //     );
  //   }
  // Handle nested objects for specific keys
  

  // Handle generic objects

  return null;
};

const DetailItem: React.FC<DetailItemProps> = ({ data }) => {
  return (
    <div className="flex gap-3">
      <div className="w-full flex flex-col gap-4">
        {Object.entries(data).map(([key, value], index) => (
          <div key={index} className="detail_topic flex flex-col gap-1 w-full">
            <h5 className="self-start font-bold capitalize">
              {startCase(key)}
            </h5>
            <div className="flex flex-col gap-3">{renderValue(value, key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailItem;
