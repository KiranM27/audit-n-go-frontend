import axios from "axios";

const localhost = "http://127.0.0.1:3030";
const apiURL = "";
const endpoint = `${localhost}${apiURL}`;

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});