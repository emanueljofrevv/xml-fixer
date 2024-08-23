export const LoaderModal = () => {
  const container = document.createElement("div");
  container.className = "loader-modal";

  const modalContent = document.createElement("div");
  modalContent.className = "loader-content";
  modalContent.innerHTML = `
      <div class="loader"></div>
      <p>Processing your file, please wait...</p>
    `;

  container.appendChild(modalContent);
  return container;
};
