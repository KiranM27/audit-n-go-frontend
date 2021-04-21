import React from "react";
import Cookies from "js-cookie";
import { useHistory, Redirect } from "react-router-dom";

export const RestrictAccess = (url_link) => {
  const isLoggedIn = Cookies.get("isLoggedIn");
  const isAdmin = JSON.parse(Cookies.get("loggedInUser")).isAdmin;
  console.log(isAdmin);
  const history = useHistory();

  if (isLoggedIn != 1) {
    history.push("/");
  }

  if (isAdmin == false) {
    history.push(url_link);
  }
};

export default RestrictAccess;
