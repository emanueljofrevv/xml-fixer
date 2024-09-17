import { IconButton } from "./../IconButton/IconButton.js";

export const ViewButton = (onClick) =>
  IconButton({
    iconClass: "fas fa-eye",
    label: "View Details",
    onClick,
    className: "view-btn",
  });

export const DeleteButton = (onClick) =>
  IconButton({
    iconClass: "fas fa-trash-alt",
    label: "Delete File",
    onClick,
    className: "delete-btn",
  });

export const DownloadButton = (onClick) =>
  IconButton({
    iconClass: "fas fa-download",
    label: "Download File",
    onClick,
    className: "download-btn",
  });
