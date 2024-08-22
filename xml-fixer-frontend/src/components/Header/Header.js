export const Header = () => {
  const header = document.createElement("header");
  header.className = "app-header";

  const logo = document.createElement("img");
  logo.src = "./../../../assets/images/vvlogo.svg";
  logo.alt = "Company Logo";
  logo.className = "logo";

  header.appendChild(logo);

  return header;
};
