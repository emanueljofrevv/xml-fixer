import { uploadFile, deleteAllFiles } from "./../../services/api.js";
import { ConfirmationModal } from "./../ConfirmationModal/ConfirmationModal.js";
import { LoaderModal } from "./../LoaderModal/LoaderModal.js";

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
      const loader = LoaderModal();
      container.appendChild(loader);

      try {
        const result = await uploadFile(file);
        onFileUploaded(result);
      } finally {
        container.removeChild(loader);
      }
    }
  });

  const uploadButton = document.createElement("button");
  uploadButton.className = "upload-btn";
  uploadButton.textContent = "Select File";
  uploadButton.addEventListener("click", () => input.click());

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-all-btn";
  deleteButton.textContent = "Delete all files";

  deleteButton.addEventListener("click", () => {
    ConfirmationModal({
      message: "Are you sure you want to delete all files?",
      confirmLabel: "Yes, Delete All",
      cancelLabel: "Cancel",
      onConfirm: async () => {
        try {
          const response = await deleteAllFiles();
          if (response.ok) {
            onFilesDeleted();
          } else {
            console.error("Failed to delete files");
          }
        } catch (error) {
          console.error("Error deleting files:", error);
        }
      },
      onCancel: () => {
        console.log("Delete action cancelled");
      },
    });
  });

  uploadContainer.appendChild(instructionText);
  uploadContainer.appendChild(uploadButton);
  uploadContainer.appendChild(input);

  container.appendChild(uploadContainer);
  container.appendChild(deleteButton);

  return container;
}
