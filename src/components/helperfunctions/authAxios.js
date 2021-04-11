import axios from "axios";

const localhost = "";
const apiURL = "";
const endpoint = `${localhost}${apiURL}`;

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});