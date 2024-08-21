import "./app.js";
import { router } from "./routes/router.js";

window.addEventListener("load", router);
window.addEventListener("popstate", router);
