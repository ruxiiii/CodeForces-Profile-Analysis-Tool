import { useEffect, useState } from "react";
import Chart from "react-google-charts";

const BarChartContainer = ({ data: parentData, getData, axisTitle }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (parentData) {
      setData([axisTitle, ...getData(parentData)]);
    }
  }, [parentData, getData, axisTitle]);

  return data ? <Chart chartType="Bar" data={data} /> : <></>;
};

export default BarChartContainer;
