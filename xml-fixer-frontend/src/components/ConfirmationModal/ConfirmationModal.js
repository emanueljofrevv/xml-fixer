export const ConfirmationModal = ({
  message = "Are you sure?",
  confirmLabel = "Yes, Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const modal = document.createElement("div");
  modal.className = "confirmation-modal";

  modal.innerHTML = `
      <div class="modal-content">
        <h3>Confirm</h3>
        <p>${message}</p>
        <button class="confirm-btn">${confirmLabel}</button>
        <button class="cancel-btn">${cancelLabel}</button>
      </div>
    `;

  modal.querySelector(".confirm-btn").addEventListener("click", () => {
    onConfirm();
    document.body.removeChild(modal);
  });

  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    onCancel();
    document.body.removeChild(modal);
  });

  document.body.appendChild(modal);

  return modal;
};
