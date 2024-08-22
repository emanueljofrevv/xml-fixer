import { uploadFile } from "./../../services/api.js";

export function FileUpload(onFileUploaded) {
  const container = document.createElement("div");
  container.className = "file-upload";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xml";
  input.addEventListener("change", async () => {
    const file = input.files[0];

    if (file) {
      const result = await uploadFile(file);
      onFileUploaded(result);
    }
  });

  container.appendChild(input);

  return container;
}
