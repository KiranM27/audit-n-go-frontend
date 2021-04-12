import axios from "axios";

const localhost = "http://auditngobackend-env-1.eba-c9ump7bh.ap-southeast-1.elasticbeanstalk.com";
const apiURL = "";
const endpoint = `${localhost}${apiURL}`;

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});