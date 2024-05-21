import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import moment from "moment";
import _ from "lodash";

const LineChart = ({ data: parentData, getData, axisTitle }) => {
  const [data, setData] = useState();
  const [hAxisTicks, setHAxisTicks] = useState([]);

  useEffect(() => {
    const sortedData = _.sortBy(parentData, ["ratingUpdateTimeSeconds"]);

    const temp = [];
    let curr = moment();
    let last = moment();

    if (sortedData.length > 0) {
      last = moment.unix(sortedData[0].ratingUpdateTimeSeconds);
    }

    const diff = curr.diff(last, "months");

    let step;

    if (diff <= 12) {
      step = 1;
    } else if (diff <= 24) {
      step = 2;
    } else if (diff <= 36) {
      step = 3;
    } else if (diff <= 48) {
      step = 4;
    } else if (diff <= 60) {
      step = 6;
    } else {
      step = 12;
    }

    while (curr >= last) {
      const t = curr.startOf("month").unix();
      const monthName = curr.format("MMM");
      const year = curr.format("YYYY");
      temp.push({ v: t, f: `${monthName} ${year}` });
      curr = curr.subtract(step, "months");
    }

    setHAxisTicks(temp);
    // console.log(moment().subtract(1, "months").startOf("month").format("MMM"));
  }, [parentData]);

  useEffect(() => {
    if (parentData) {
      setData([axisTitle, ...getData(parentData)]);
    }
  }, [parentData, getData, axisTitle]);

  const options = {
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: { ticks: hAxisTicks },
    pointSize: 8,
  };

  return data ? (
    <Chart
      chartType="LineChart"
      width="100%"
      height="350px"
      data={data}
      options={options}
    />
  ) : null;
};

export default LineChart;
