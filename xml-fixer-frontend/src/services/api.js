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
  const response = await fetch(`${API_BASE_URL}/files`);
  return response.json();
};

export const getFileDetails = async (fileId) => {
  const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
  return response.json();
};
