import { parseMarkdown } from "../../helpers/parse-markdown.js";

export const FileModal = (fileDetails, onClose) => {
  const container = document.createElement("div");
  container.className = "file-modal";

  const markdownHtml = parseMarkdown(fileDetails);

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  modalContent.innerHTML = `
        <div class="modal-header">
            <h2>File Details</h2>
        </div>
        <div class="modal-body">
            <div class="modal-body-content">${markdownHtml}</div>
        </div>
        <div class="modal-footer">
            <button class="close-btn">Close</button>
        </div>
    `;

  modalContent.querySelector(".close-btn").addEventListener("click", onClose);

  container.appendChild(modalContent);

  return container;
};
