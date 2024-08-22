export const FileModal = (fileDetails, onClose) => {
  const container = document.createElement("div");
  container.className = "file-modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.innerHTML = `
        <h2>File Details</h2>
        <pre>${JSON.stringify(fileDetails, null, 2)}</pre>
        <button class="close-btn">Close</button>
    `;

  modalContent.querySelector(".close-btn").addEventListener("click", onClose);

  container.appendChild(modalContent);

  return container;
};
