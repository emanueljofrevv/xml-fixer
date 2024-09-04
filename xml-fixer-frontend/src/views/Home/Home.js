import { FileUpload } from "./../../components/FileUpload/FileUpload.js";
import { FileList } from "./../../components/FileList/FileList.js";
import { FileModal } from "./../../components/FileModal/FileModal.js";
import { Header } from "./../../components/Header/Header.js";
import { Pagination } from "./../../components/Pagination/Pagination.js";
import { getFileDetails, downloadFile } from "./../../services/api.js";
import { paginate } from "../../helpers/paginate.js";
import { ITEMS_PER_PAGE } from "../../config/config.js";

let currentPage = 1;

export const Home = () => {
  const container = document.createElement("div");
  container.className = "home-view";

  const header = Header();

  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container";

  const renderFileList = () => {
    const paginatedRecords = paginate(
      window.filesData,
      currentPage,
      ITEMS_PER_PAGE
    );

    const fileList = FileList(
      paginatedRecords,
      async (fileId) => {
        // Details action
        const file = window.filesData.find((file) => file.id === fileId);
        const fileDetails = await getFileDetails(fileId);
        showModal(fileDetails.markdown, file.originalFileName);
      },
      (fileId) => {
        // Delete action
        window.filesData = window.filesData.filter(
          (file) => file.id !== fileId
        );
        renderFileList();
      },
      async (fileId) => {
        // Download action
        try {
          const fileBlob = await downloadFile(fileId);
          const file = window.filesData.find((file) => file.id === fileId);

          const url = URL.createObjectURL(fileBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${file.originalFileName}.xml`;
          a.click();

          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      }
    );

    const paginationControls = Pagination({
      currentPage,
      totalItems: window.filesData.length,
      itemsPerPage: ITEMS_PER_PAGE,
      onPageChange: (newPage) => {
        currentPage = newPage;
        renderFileList();
      },
    });

    tableContainer.innerHTML = "";
    tableContainer.appendChild(fileList);
    tableContainer.appendChild(paginationControls);
  };

  const fileUpload = FileUpload(
    async (uploadedFile) => {
      window.filesData.unshift(uploadedFile);
      renderFileList();
    },
    async () => {
      window.filesData = [];
      renderFileList();
    }
  );

  const showModal = (fileDetails, fileName) => {
    const modal = FileModal(
      fileDetails,
      () => container.removeChild(modal),
      fileName
    );
    container.appendChild(modal);
  };

  renderFileList();

  container.appendChild(fileUpload);
  container.appendChild(tableContainer);

  document.body.prepend(header);

  return container;
};
