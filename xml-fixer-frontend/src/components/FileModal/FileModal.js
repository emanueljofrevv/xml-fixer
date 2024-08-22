import { parseMarkdown } from "../../helpers/parse-markdown.js";

export const FileModal = (fileDetails, onClose) => {
  const container = document.createElement("div");
  container.className = "file-modal";

  const markdownHtml = parseMarkdown(fileDetails);

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.innerHTML = `
        <h2>File Details</h2>
        <div>${markdownHtml}</div>
        <button class="close-btn">Close</button>
    `;

  modalContent.querySelector(".close-btn").addEventListener("click", onClose);

  container.appendChild(modalContent);

  return container;
};
