export const FileList = (files, onViewDetails) => {
  const container = document.createElement("div");
  container.className = "file-list";

  const table = document.createElement("table");
  table.innerHTML = `
        <thead>
            <tr>
                <th>File</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${files
              .map(
                (file) => `
                <tr>
                    <td>${file.name}</td>
                    <td>
                        <button class="view-btn" data-id="${file.id}">Ver</button>
                    </td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    `;

  table.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-btn")) {
      const fileId = e.target.getAttribute("data-id");
      onViewDetails(fileId);
    }
  });

  container.appendChild(table);

  return container;
};
