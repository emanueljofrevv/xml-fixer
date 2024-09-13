import { getFiles } from "./services/api.js";

window.addEventListener("load", async () => {
  if (!window.filesData) {
    const files = await getFiles();
    window.filesData = files;
  }
});
