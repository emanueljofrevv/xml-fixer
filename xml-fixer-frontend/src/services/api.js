import { API_BASE_URL } from "./../config/config.js";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const getFiles = async () => {
  //const response = await fetch(`${API_BASE_URL}/files`);
  const response = [
    { name: "File 1", id: 1 },
    { name: "File 2", id: 2 },
    { name: "File 3", id: 3 },
  ];
  return response;
};

export const getFileDetails = async (fileId) => {
  //const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
  const files = [
    { name: "File 1", id: 1 },
    { name: "File 2", id: 2 },
    { name: "File 3", id: 3 },
  ];
  const response = files.find((file) => file.id === fileId);
  return response;
};
