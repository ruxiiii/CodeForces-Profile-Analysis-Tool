import moment from "moment/moment";

export const getProblemsCount = (data) => {
  const solved = new Set();
  const tried = new Set();
  data?.forEach((value) => {
    const name = value?.problem?.name;
    const verdict = value?.verdict;

    if (!solved.has(name) && verdict === "OK") {
      solved.add(name);
    }

    if (!tried.has(name)) {
      tried.add(name);
    }
  });

  return {
    tried: tried.size,
    solved: solved.size,
    unsolved: tried.size - solved.size,
  };
};

export const getUnsolvedProblems = (data) => {
  const solved = new Set();
  const tried = new Set();
  const triedMap = {};

  data?.forEach((value) => {
    const name = value?.problem?.name;
    const verdict = value?.verdict;

    if (!solved.has(name) && verdict === "OK") {
      solved.add(name);
    }

    if (!tried.has(name)) {
      tried.add(name);
      triedMap[name] = value;
    }
  });

  const arr = [];

  tried.forEach((name) => {
    if (!solved.has(name)) {
      const value = triedMap[name];

      const contestId = value?.problem?.contestId;
      const problemIndex = value?.problem?.index;

      console.log(value);
      arr.push({
        name: `${contestId}-${problemIndex}`,
        link: `https://codeforces.com/contest/${contestId}/problem/${problemIndex}`,
      });
    }
  });

  return arr;
};

export const getProblemRatingDistribution = (data) => {
  const mp = {};
  const set = new Set();
  data?.forEach((value) => {
    const rating = value?.problem?.rating;
    const name = value?.problem?.name;
    const verdict = value?.verdict;
    if (rating && !set.has(name) && verdict === "OK") {
      if (mp[rating]) {
        mp[rating] += 1;
      } else {
        mp[rating] = 1;
      }
      set.add(name);
    }
  });

  let arr = [];
  for (let key in mp) {
    arr.push([key, mp[key]]);
  }

  return arr;
};

export const getProblemTagDistribution = (data) => {
  const mp = {};
  const set = new Set();
  data?.forEach((value) => {
    const tags = value?.problem?.tags;
    const name = value?.problem?.name;
    const verdict = value?.verdict;
    if (tags && !set.has(name) && verdict === "OK") {
      tags.forEach((tag) => {
        if (mp[tag]) {
          mp[tag] += 1;
        } else {
          mp[tag] = 1;
        }
      });
      set.add(name);
    }
  });

  let arr = [];
  for (let key in mp) {
    arr.push([`${key}: ${mp[key]}`, mp[key]]);
  }

  return arr;
};

export const getDataForCalendarHeatmap = (data) => {
  const mp = {};
  data.forEach((value) => {
    const t = value?.creationTimeSeconds;
    if (t) {
      const d = moment(new Date(t * 1000)).format("YYYY-MM-DD");
      if (mp[d]) {
        mp[d] += 1;
      } else {
        mp[d] = 1;
      }
    }
  });

  const arr = [];
  for (let key in mp) {
    let value;
    if (mp[key] < 1) {
      value = 0;
    } else if (mp[key] < 3) {
      value = 1;
    } else if (mp[key] < 5) {
      value = 2;
    } else {
      value = 3;
    }
    arr.push({
      date: new Date(key),
      count: value,
      numberOfSubmissions: mp[key],
    });
  }

  return arr;
};

export const getContestRatingChanges = (data) => {
  const arr = [];
  data.forEach((value) => {
    arr.push([
      {
        v: value.ratingUpdateTimeSeconds,
        f: `Date: ${moment
          .unix(value.ratingUpdateTimeSeconds)
          .format("DD/MM/YYYY")}`,
      },
      value.newRating,
    ]);
  });

  return arr;
};

export const getYearsOptions = (data) => {
  const currentYear = moment().year();

  if (data && data.length) {
    const n = data.length;

    const firstYear = moment.unix(data[n - 1].creationTimeSeconds).year();

    console.log("firstYear: ", firstYear);

    const options = [{ label: "Choose year" }];

    for (let year = currentYear; year >= firstYear; year--) {
      options.push({
        label: `${year}`,
        value: `${year}`,
      });
    }

    return options;
  }

  return [
    { label: "Choose year" },
    { label: `${currentYear}`, value: `${currentYear}` },
  ];
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export const getRandomProblem = (problemList) => {
  if (!problemList || !problemList.length) {
    return undefined;
  }

  const n = problemList.length;
  const index = getRandomInt(n);

  return problemList[index];
};
