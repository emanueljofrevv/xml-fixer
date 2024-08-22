import { getFiles } from "../services/api.js";
import { Home } from "./../views/Home/Home.js";

const routes = {
  "/": Home,
};

export const router = async () => {
  const path = window.location.pathname || "/";

  if (!window.filesData) {
    window.filesData = await getFiles();
  }

  const view = routes[path] ? routes[path]() : routes["/"]();

  document.getElementById("app").innerHTML = "";
  document.getElementById("app").appendChild(view);
};
