import { uploadFile, deleteAllFiles } from "./../../services/api.js";

export function FileUpload(onFileUploaded, onFilesDeleted) {
  const container = document.createElement("div");
  container.className = "file-upload";

  const uploadContainer = document.createElement("div");
  uploadContainer.className = "upload-container";

  const instructionText = document.createElement("p");
  instructionText.className = "upload-instruction";
  instructionText.textContent = "Upload your XML file";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xml";
  input.className = "file-input";
  input.addEventListener("change", async () => {
    const file = input.files[0];

    if (file) {
      const result = await uploadFile(file);
      onFileUploaded(result);
    }
  });

  const uploadButton = document.createElement("button");
  uploadButton.className = "upload-btn";
  uploadButton.textContent = "Select File";
  uploadButton.addEventListener("click", () => input.click());

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-all-btn";
  deleteButton.textContent = "Delete all files";
  deleteButton.addEventListener("click", async () => {
    const response = await deleteAllFiles();
    if (response.ok) {
      onFilesDeleted();
    } else {
      console.error("Failed to delete files");
    }
  });

  uploadContainer.appendChild(instructionText);
  uploadContainer.appendChild(uploadButton);
  uploadContainer.appendChild(input);

  container.appendChild(uploadContainer);
  container.appendChild(deleteButton);

  return container;
}
