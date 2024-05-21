import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import moment from "moment";
import "./index.css";
// import ReactTooltip from "react-tooltip";

const CalendarHeatMap = ({ data: parentData, getData, year }) => {
  const [data, setData] = useState();
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, "years").toDate()
  );
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (year) {
      const start_date = moment(`01-01-${year}`).toDate();
      const end_date = moment(`12-31-${year}`).toDate();

      console.log("Start date: ", start_date);
      console.log("End date: ", end_date);

      setStartDate(start_date);
      setEndDate(end_date);
    } else {
      setStartDate(moment(new Date()).subtract(1, "years").toDate());
      setEndDate(new Date());
    }
  }, [year]);

  useEffect(() => {
    if (parentData) {
      setData(getData(parentData));
    }
  }, [parentData, getData]);

  return data ? (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}
        classForValue={(value) => {
          if (!value || value < 1) {
            return "color-empty";
          }
          return `color-${value.count}`;
        }}
        showWeekdayLabels={true}
        tooltipDataAttrs={(value) => {
          if (value.date) {
            return {
              "data-tip": `${
                value.numberOfSubmissions || 0
              } submissions on ${moment(value.date).format("DD/MM/YYYY")}`,
            };
          }
        }}
      />
      {/* <ReactTooltip /> */}
    </>
  ) : (
    <></>
  );
};

export default CalendarHeatMap;
