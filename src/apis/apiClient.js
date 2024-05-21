import axios from "axios";

const apiInstance = () => {
  const apiClient = axios.create({
    baseURL: "https://codeforces.com/api",
  });

  return apiClient;
};

const apiClient = apiInstance();

export default apiClient;
