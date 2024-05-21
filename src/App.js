import { useEffect, useState } from "react";
import apiClient from "./apis/apiClient";
import BarChart from "./components/BarChart";
import CalendarHeatMap from "./components/CalendarHeatMap";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import {
  getProblemRatingDistribution,
  getProblemTagDistribution,
  getDataForCalendarHeatmap,
  getContestRatingChanges,
  getProblemsCount,
  getUnsolvedProblems,
  getYearsOptions,
  getRandomProblem,
} from "./utils";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import ReactLoading from "react-loading";
import { Container } from "@mui/material";

import { ContestLister } from "./components/ContestsLister";

import Select from "react-select";

import axios from "axios";

const makeTwoDigit = (d) => {
  if (d < 10) {
    return `0${d}`;
  }

  return d;
};

const App = () => {
  const [username, setUsername] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [contestData, setContestData] = useState();
  const [problemsCount, setProblemsCount] = useState(0);
  const [unsolvedProblemsList, setUnsolvedProblemsList] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [year, setYear] = useState({ label: "Choose Year" });
  const [problemList, setProblemList] = useState([]);
  const [problem, setProblem] = useState();
  const [contestsList, setContestsList] = useState([]);

  const fetchUserInfo = async () => {
    setData(null);
    setLoading(true);
    try {
      let response = await apiClient.get(`/user.status?handle=${username}`);
      setData(response?.data?.result);

      response = await apiClient.get(`/user.rating?handle=${username}`);
      setContestData(response?.data?.result);
    } catch (error) {
      console.log("Error: ", error);
      if (error?.response?.status === 400) {
        toast("Invalid Codeforces Handle");
      } else {
        toast("Something went wrong");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (data) {
      setProblemsCount(getProblemsCount(data));
      setUnsolvedProblemsList(getUnsolvedProblems(data));
      setYearOptions(getYearsOptions(data));
    }
  }, [data]);

  const getProblemList = async () => {
    try {
      const response = await apiClient.get("/problemset.problems");
      setProblemList(response?.data?.result?.problems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProblemList();
  }, []);

  useEffect(() => {
    console.log("Problem list: ", problemList);
    const randomProblem = getRandomProblem(problemList);
    setProblem(randomProblem);
    console.log("Random problem: ", randomProblem);
  }, [problemList]);

  const fetchContestsList = async () => {
    const site = "codeforces";
    const res = await axios.get(`https://kontests.net/api/v1/${site}`);
    let data = res.data;
    data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    data = data.map((value) => {
      let d = parseInt(value.duration) / 3600;
      if (d >= 24) {
        d = parseInt(d / 24);
        d = `${d} days`;
      } else {
        if (d % 0.5 !== 0) {
          d = d.toFixed(2);
        }
        d = `${d} hours`;
      }

      let s = value.site;
      if (!value.site) {
        s = site
          .split("_")
          .map((txt) => txt.charAt(0).toUpperCase() + txt.slice(1))
          .join("");
      }

      let t = new Date(value.start_time);
      const start_date = `${makeTwoDigit(t.getDate())}-${makeTwoDigit(
        t.getMonth() + 1
      )}-${t.getFullYear()}`;
      const start_time = `${makeTwoDigit(t.getHours())}:${makeTwoDigit(
        t.getMinutes()
      )}`;

      t = new Date(value.end_time);
      const end_date = `${makeTwoDigit(t.getDate())}-${makeTwoDigit(
        t.getMonth() + 1
      )}-${t.getFullYear()}`;
      const end_time = `${makeTwoDigit(t.getHours())}:${makeTwoDigit(
        t.getMinutes()
      )}`;

      value = {
        ...value,
        duration: d,
        site: s,
        start_date: start_date,
        start_time: start_time,
        end_date: end_date,
        end_time: end_time,
      };
      return value;
    });
    setContestsList(data);
  };

  useEffect(() => {
    fetchContestsList();
  }, []);

  const displayProblem = (problem) => {
    if (!problem) {
      return <></>;
    }

    const link = `https://codeforces.com/problemset/problem/${problem?.contestId}/${problem?.index}`;

    return (
      <div className="problemCardWrapper">
        <div
          className="problemCard"
          onClick={() => {
            window.location = link;
          }}
        >
          <span>
            {problem?.contestId}-{problem?.index}
          </span>
          <span>{problem.name}</span>
          <span>{problem.rating}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="main-container">
        <h2 className="app-heading">Codeforces Profile Analyzer</h2>
        <input
          className="handle-input"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter codeforces handle"
        />
        <button className="submit-button" onClick={fetchUserInfo}>
          Search
        </button>
        {loading ? (
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "200px",
            }}
          >
            <ReactLoading type="spin" color="#000000" height={60} width={60} />
          </Container>
        ) : (
          data && (
            <div style={{ marginTop: 20 }}>
              <div className="section-container">
                <h3>Solved Problem's Rating Distribution</h3>

                <BarChart
                  getData={getProblemRatingDistribution}
                  data={data}
                  axisTitle={["Problem Rating", "Solved Count"]}
                />
              </div>

              <div className="section-container">
                <h3>Solved Problem's Tags Distribution</h3>

                <PieChart
                  getData={getProblemTagDistribution}
                  data={data}
                  axisTitle={["Problem Tag", "Solved Count"]}
                />
              </div>

              <div className="section-container">
                <h3>User contest rating change</h3>

                <LineChart
                  data={contestData}
                  getData={getContestRatingChanges}
                  axisTitle={["Time", "Rating"]}
                />
              </div>

              <div className="section-container">
                <h3>Stats</h3>

                <p>Number of contests: {contestData.length}</p>
                <p>Number of problems tried: {problemsCount.tried}</p>
                <p>Number of problems solved: {problemsCount.solved}</p>
                <p>Number of problems unsolved: {problemsCount.unsolved}</p>
              </div>

              {unsolvedProblemsList.length && (
                <div className="section-container">
                  <h3>Unsolved Problems</h3>

                  <div className="unsolved-problems-container">
                    {unsolvedProblemsList.map((value) => (
                      <p>
                        <a href={value.link} target="_blank">
                          {value.name}
                        </a>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="section-container">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>User Activity Heat Map</h3>

                  <div
                    style={{
                      width: 180,
                    }}
                  >
                    <Select
                      options={yearOptions}
                      onChange={(option) => {
                        setYear(option);
                      }}
                      value={year}
                    />
                  </div>
                </div>

                <CalendarHeatMap
                  getData={getDataForCalendarHeatmap}
                  data={data}
                  year={year.value}
                />
              </div>

              <div className="section-container">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>Random problem</h3>

                  <button
                    className="submit-button"
                    onClick={() => {
                      setProblem(getRandomProblem(problemList));
                    }}
                  >
                    Search Problem
                  </button>
                </div>

                {displayProblem(problem)}
              </div>

              <div className="section-container">
                <h3>Current or Upcoming Contests</h3>

                <ContestLister contestsList={contestsList} />
              </div>
            </div>
          )
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default App;
