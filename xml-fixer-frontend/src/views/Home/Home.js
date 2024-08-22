import { FileUpload } from "./../../components/FileUpload/FileUpload.js";
import { FileList } from "./../../components/FileList/FileList.js";
import { FileModal } from "./../../components/FileModal/FileModal.js";
import { Header } from "./../../components/Header/Header.js";
import { getFileDetails } from "./../../services/api.js";

export const Home = () => {
  const container = document.createElement("div");
  container.className = "home-view";

  const header = Header();

  const fileUpload = FileUpload(async (uploadedFile) => {
    window.filesData.push(uploadedFile);
    renderFileList();
  });

  const renderFileList = () => {
    const fileList = FileList(window.filesData, async (fileId) => {
      const fileDetails = await getFileDetails(Number(fileId));
      showModal(fileDetails);
    });

    container.innerHTML = "";
    container.appendChild(fileUpload);
    container.appendChild(fileList);
  };

  const showModal = (fileDetails) => {
    const modal = FileModal(fileDetails, () => container.removeChild(modal));
    container.appendChild(modal);
  };

  renderFileList();

  document.body.prepend(header);

  return container;
};
