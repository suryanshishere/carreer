// //TODO-------------------------------------------------------
// interface IRowData {
//     [key: string]: string | number;
//   }
  
//   interface DynamicTableProps {
//     headers: string[];
//     onSaveData: (newData: IRowData[]) => void;
//   }
  
//   const DynamicTable: React.FC<DynamicTableProps> = ({ headers, onSaveData }) => {
//     const [tableData, setTableData] = useState<IRowData[]>([]); // Store added rows
//     const [tempData, setTempData] = useState<IRowData[]>([]); // Temporary data to save
  
//     const handleAddRow = () => {
//       const newRow = headers.reduce((acc, header) => {
//         acc[header] = ""; // Initialize each column with an empty value
//         return acc;
//       }, {} as IRowData);
  
//       setTableData((prevData) => [...prevData, newRow]);
//       console.log("Row Added:", newRow);
//     };
  
//     const handleRemoveRow = (index: number) => {
//       const updatedData = tableData.filter((_, i) => i !== index);
//       setTableData(updatedData);
//       console.log("Row Removed at Index:", index);
//     };
  
//     const handleInputChange = (
//       index: number,
//       key: string,
//       value: string | number
//     ) => {
//       const updatedData = [...tableData];
//       updatedData[index][key] = value;
//       setTableData(updatedData);
//       console.log("Updated Row:", updatedData[index]);
//     };
  
//     const handleSave = () => {
//       setTempData([...tempData, ...tableData]); // Store the added rows for saving
//       onSaveData(tempData); // Pass data to parent component for saving
//       setTableData([]); // Clear the table after saving
//       console.log("Data Saved:", tempData);
//     };
  
//     return (
//       <div>
//         <table className="border-collapse border-2 border-custom-gray w-full mt-3">
//           <thead>
//             <tr>
//               {headers.map((header) => (
//                 <th
//                   key={header}
//                   className="border border-custom-gray px-2 py-1 text-left"
//                 >
//                   {header.replace(/_/g, " ")}
//                 </th>
//               ))}
//               <th className="border border-custom-gray px-2 py-1 text-left">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {headers.map((header) => (
//                   <td
//                     key={header}
//                     className="border border-custom-gray px-2 py-1"
//                   >
//                     <input
//                       type={typeof row[header] === "number" ? "number" : "text"}
//                       value={row[header] || ""}
//                       onChange={(e) =>
//                         handleInputChange(rowIndex, header, e.target.value)
//                       }
//                       className="w-full px-1 py-0.5 border border-gray-300 rounded"
//                     />
//                   </td>
//                 ))}
//                 <td className="border border-custom-gray px-2 py-1 text-center">
//                   <button
//                     onClick={() => handleRemoveRow(rowIndex)}
//                     className="text-custom-red hover:underline"
//                   >
//                     Remove
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <button
//           onClick={handleAddRow}
//           className="mt-3 px-4 py-2 bg-custom-blue text-custom-white rounded hover:bg-custom-blue"
//         >
//           Add Row
//         </button>
//         <button
//           onClick={handleSave}
//           className="mt-3 px-4 py-2 bg-custom-green text-custom-white rounded hover:bg-green-600"
//         >
//           Save
//         </button>
//       </div>
//     );
//   };
  
//   export default DynamicTable;
  