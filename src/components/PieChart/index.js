import Chart from "react-google-charts";
import { useEffect, useState } from "react";

const PieChartContainer = ({ data: parentData, getData, axisTitle }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (parentData) {
      const tempData = getData(parentData);
      // sort nested array by index 1 item
      tempData
        .sort((a, b) => {
          if (a[1] < b[1]) {
            return -1;
          } else if (a[1] > b[1]) {
            return 1;
          } else {
            return 0;
          }
        })
        .reverse();
      setData([axisTitle, ...tempData]);
    }
  }, [parentData, getData, axisTitle]);

  return data ? (
    <Chart
      height={400}
      chartType="PieChart"
      options={{ pieSliceText: "none" }}
      data={data}
    />
  ) : (
    <></>
  );
};

export default PieChartContainer;
