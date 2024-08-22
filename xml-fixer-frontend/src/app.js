import { getFiles } from "./services/api.js";

window.addEventListener("load", async () => {
  const files = await getFiles();
  window.filesData = files;
});
