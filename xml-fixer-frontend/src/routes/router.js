import { Home } from "./../views/Home/Home.js";

const routes = {
  "/": Home,
};

export const router = () => {
  const path = window.location.pathname || "/";

  const view = routes[path] ? routes[path]() : routes["/"]();

  document.getElementById("app").innerHTML = "";
  document.getElementById("app").appendChild(view);
};
