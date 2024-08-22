export const parseMarkdown = (markdown) => {
  let html = markdown;

  // Convert headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Convert bold and italic
  html = html.replace(/\*\*\*(.*)\*\*\*/gim, "<b><i>$1</i></b>");
  html = html.replace(/\*\*(.*)\*\*/gim, "<b>$1</b>");
  html = html.replace(/\*(.*)\*/gim, "<i>$1</i>");

  // Convert unordered lists
  html = html.replace(/^\* (.*)$/gim, "<ul><li>$1</li></ul>");

  // Convert links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

  // Convert new lines
  html = html.replace(/\n/gim, "<br>");

  return html.trim(); // Trim any remaining whitespace
};
