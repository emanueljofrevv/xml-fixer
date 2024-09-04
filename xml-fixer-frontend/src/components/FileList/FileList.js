import { formatDate } from "../../helpers/format-date.js";
import { deleteFile } from "../../services/api.js";
import { ConfirmationModal } from "./../ConfirmationModal/ConfirmationModal.js";
import {
  ViewButton,
  DeleteButton,
  DownloadButton,
} from "./../ActionButtons/ActionButtons.js";

export const FileList = (
  files,
  onViewDetails,
  onDeleteFile,
  onDownloadFile
) => {
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
            ${
              files.length
                ? files
                    .map(
                      (file) => `
                <tr>
                    <td class="text">${file.originalFileName || file.id}</td>
                    <td class="text">${formatDate(file.createDate)}</td>
                    <td class="text">v${file.version || 1}</td>
                    <td class="action-buttons" data-id="${file.id}"></td>
                </tr>
            `
                    )
                    .join("")
                : `<tr class="no-records"><td colspan=4>There are no files to display. Please upload an XML file.</td></tr>`
            }
        </tbody>
    `;

  // Append buttons after the table is built
  files.forEach((file) => {
    const actionCell = table.querySelector(
      `.action-buttons[data-id="${file.id}"]`
    );

    // View action
    const viewButton = ViewButton(() => onViewDetails(file.id));

    // Delete action
    const deleteButton = DeleteButton(() => {
      ConfirmationModal({
        message: "Are you sure you want to delete this file?",
        confirmLabel: "Yes, Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          try {
            await deleteFile(file.id);
            onDeleteFile(file.id);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        },
        onCancel: () => {
          console.log("Delete action cancelled");
        },
      });
    });

    // Download action
    const downloadButton = DownloadButton(() => onDownloadFile(file.id));

    actionCell.appendChild(viewButton);
    actionCell.appendChild(deleteButton);
    actionCell.appendChild(downloadButton);
  });

  container.appendChild(table);

  return container;
};
