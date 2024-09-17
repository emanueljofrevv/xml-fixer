export const IconButton = ({ iconClass, label, onClick, className = "" }) => {
  const button = document.createElement("button");
  button.className = `icon-button ${className}`;
  button.innerHTML = `
      <i class="${iconClass}"></i>
      <span class="sr-only">${label}</span>
    `;

  button.addEventListener("click", onClick);

  return button;
};
