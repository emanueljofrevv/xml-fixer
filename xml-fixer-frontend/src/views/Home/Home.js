import { FileUpload } from "./../../components/FileUpload/FileUpload.js";
import { FileList } from "./../../components/FileList/FileList.js";
import { FileModal } from "./../../components/FileModal/FileModal.js";
import { Header } from "./../../components/Header/Header.js";
import { getFileDetails, downloadFile } from "./../../services/api.js";

export const Home = () => {
  const container = document.createElement("div");
  container.className = "home-view";

  const header = Header();

  const renderFileList = () => {
    const fileList = FileList(
      window.filesData,
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

    container.innerHTML = "";
    container.appendChild(fileUpload);
    container.appendChild(fileList);
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

  document.body.prepend(header);

  return container;
};
