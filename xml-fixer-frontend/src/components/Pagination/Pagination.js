export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-controls";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const prevButton = document.createElement("button");
  prevButton.textContent = "<";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  });

  const nextButton = document.createElement("button");
  nextButton.textContent = ">";
  nextButton.disabled = currentPage === totalPages || totalItems === 0;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  });

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(nextButton);

  return paginationContainer;
};
