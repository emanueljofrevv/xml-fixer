import { formatDate } from "../../helpers/format-date.js";
import { deleteFile } from "../../services/api.js";
import { ConfirmationModal } from "./../ConfirmationModal/ConfirmationModal.js";

export const FileList = (files, onViewDetails, onDeleteFile) => {
  const container = document.createElement("div");
  container.className = "file-list";

  const table = document.createElement("table");
  table.className = "styled-table";
  table.innerHTML = `
        <thead>
            <tr>
                <th>File</th>
                <th>Date</th>
                <th>Version</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${files
              .map(
                (file) => `
                <tr>
                    <td class="text">${file.originalFileName || file.id}</td>
                    <td class="text">${formatDate(file.createDate)}</td>
                    <td class="text">v${file.version || 1}</td>
                    <td>
                        <button class="view-btn" data-id="${
                          file.id
                        }">Show</button>
                        <button class="delete-btn" data-id="${
                          file.id
                        }">Delete</button>
                    </td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    `;

  table.addEventListener("click", (e) => {
    const fileId = e.target.getAttribute("data-id");

    if (e.target.classList.contains("view-btn")) {
      onViewDetails(fileId);
    }

    if (e.target.classList.contains("delete-btn")) {
      ConfirmationModal({
        message: "Are you sure you want to delete this file?",
        confirmLabel: "Yes, Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          try {
            await deleteFile(fileId);
            onDeleteFile(fileId);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        },
        onCancel: () => {
          console.log("Delete action cancelled");
        },
      });
    }
  });

  container.appendChild(table);

  return container;
};
