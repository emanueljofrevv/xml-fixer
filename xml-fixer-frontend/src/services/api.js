import { API_BASE_URL } from "./../config/config.js";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("xmlFile", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFiles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/files`);
    return response.json();
  } catch (error) {
    console.error("Error retrieving files:", error);
    throw error;
  }
};

export const getFileDetails = async (fileId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/file/${fileId}`);
    return response.json();
  } catch (error) {
    console.error("Error retrieving file details:", error);
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/file/${fileId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the file");
    }

    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const deleteAllFiles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the files");
    }

    return response;
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
};
