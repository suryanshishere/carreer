const DataStates = ({ noData }: { noData: boolean }) => {
  return (
    <div className="max-h-screen flex justify-center items-center">
      {noData && "NO data"}
    </div>
  );
};

export default DataStates;
