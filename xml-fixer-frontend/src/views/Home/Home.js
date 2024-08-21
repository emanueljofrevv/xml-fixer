import { FileUpload } from "./../../components/FileUpload/FileUpload.js";
import { FileList } from "./../../components/FileList/FileList.js";
import { FileModal } from "./../../components/FileModal/FileModal.js";
import { getFileDetails } from "./../../services/api.js";

export const Home = () => {
  const container = document.createElement("div");
  container.className = "home-view";

  const renderFileList = () => {
    const fileList = FileList(window.filesData, async (fileId) => {
      const fileDetails = await getFileDetails(fileId);
      showModal(fileDetails);
    });

    container.innerHTML = "";
    container.appendChild(fileUpload);
    container.appendChild(fileList);
  };

  const fileUpload = FileUpload(async (uploadedFile) => {
    window.filesData.push(uploadedFile);
    renderFileList();
  });

  const showModal = (fileDetails) => {
    const modal = FileModal(fileDetails, () => {
      container.removeChild(modal);
    });

    container.appendChild(modal);
  };

  renderFileList();

  return container;
};
