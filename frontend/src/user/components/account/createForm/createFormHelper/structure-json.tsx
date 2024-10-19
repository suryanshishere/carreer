import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { ITableFormData } from "./interfaceHelper";
import _ from 'lodash';

// export const structureFormData = (
//   formData: Record<string, any>,
//   formFields: any[]
// ): Record<string, any> => {
//   const structuredData: Record<string, any> = {};

//   formFields.forEach((field) => {
//     if (field.type === "object") {
//       structuredData[field.name] = structureFormData(formData, field.subItem);
//     } else {
//       let value = formData[field.name];

//       // Convert value to number if the field type is number
//       if (field.type === "number" && value !== undefined) {
//         value = Number(value);
//       }

//       structuredData[field.name] = value;
//     }
//   });

//   return structuredData;
// };


// export const structureOverallFormData = (
//   e: React.FormEvent,
//   tableFormData: ITableFormData[],
//   data: IContributeInputForm[]
// ) => {
//   e.preventDefault();

//   const formData = new FormData(e.currentTarget as HTMLFormElement);
//   const formValues: Record<string, any> = {};

//   formData.forEach((value, key) => {
//     if (formValues[key]) {
//       if (Array.isArray(formValues[key])) {
//         formValues[key].push(value);
//       } else {
//         formValues[key] = [formValues[key], value];
//       }
//     } else {
//       formValues[key] = value;
//     }
//   });

//   const structuredData = structureFormData(formValues, data);

//   // Merge tableFormData directly into structuredData
//   const mergedTableData: Record<string, any> = {};

//   tableFormData.forEach(item => {
//     Object.entries(item).forEach(([key, value]) => {
//       // Check if the key already exists in mergedTableData
//       if (mergedTableData[key]) {
//         // If it exists, ensure it's an array and push the new value
//         if (Array.isArray(mergedTableData[key])) {
//           mergedTableData[key].push(value);
//         } else {
//           mergedTableData[key] = [mergedTableData[key], value];
//         }
//       } else {
//         mergedTableData[key] = value;
//       }
//     });
//   });

//   // Final structured data now contains merged table data
//   const finalStructuredData = {
//     ...structuredData,
//     ...mergedTableData,
//   };

//   const cleanedData = removeEmptyFields(finalStructuredData);
//   console.log(cleanedData);  
  
//   return cleanedData;
// };

type Data = Record<string, any>;

export const removeEmptyFields = (data: Data): Data => {
  if (_.isObject(data) && !_.isArray(data)) {
    const cleanedData = _.reduce(data, (result, value, key) => {
      if (_.isString(value) && (value as string).trim() === '') return result;
      if (_.isNumber(value) && value === 0) return result;
      if (_.isUndefined(value)) return result;
      if(_.isNull(value)) return result;

      // Recursively clean nested objects
      const cleanedValue = _.isObject(value) ? removeEmptyFields(value) : value;

      // Only add non-empty fields to the result
      if (!(_.isObject(cleanedValue) && _.isEmpty(cleanedValue))) {
        result[key] = cleanedValue;
      }

      return result;
    }, {} as Data);

    // If the cleaned data is an empty object, return an empty object
    return _.isEmpty(cleanedData) ? {} : cleanedData;
  }
  return data;
};