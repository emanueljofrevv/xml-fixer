import { uploadFile, deleteAllFiles } from "./../../services/api.js";

export function FileUpload(onFileUploaded, onFilesDeleted) {
  const container = document.createElement("div");
  container.className = "file-upload";

  // Input to upload files
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

  // Button to delete files
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-all-btn";
  deleteButton.textContent = "Delete All Files";
  deleteButton.addEventListener("click", async () => {
    const response = await deleteAllFiles();
    if (response.ok) {
      onFilesDeleted();
    } else {
      console.error("Failed to delete files");
    }
  });

  container.appendChild(input);
  container.appendChild(deleteButton);

  return container;
}
