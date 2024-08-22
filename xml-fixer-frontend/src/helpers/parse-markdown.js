export function parseMarkdown(markdown) {
  const html = markdown
    .replace(/^#\s(.+)/gm, "<h1>$1</h1>") // h1
    .replace(/^##\s(.+)/gm, "<h2>$1</h2>") // h2
    .replace(/^###\s(.+)/gm, "<h3>$1</h3>") // h3
    .replace(/^####\s(.+)/gm, "<h4>$1</h4>") // h4
    .replace(/^>\s(.+)/gm, "<blockquote>$1</blockquote>") // blockquote
    .replace(/^\-\s(.+)/gm, "<li>$1</li>") // li
    .replace(/^\d+\.\s(.+)/gm, "<li>$1</li>") // li
    .replace(/\*\*(.+)\*\*/gm, "<strong>$1</strong>") // strong
    .replace(/\*(.+)\*/gm, "<em>$1</em>") // em
    .replace(/`(.+)`/gm, "<code>$1</code>") // code
    .replace(/---/g, "<hr />");

  const formattedHTML = html.replace(/(<li>.*<\/li>)/gm, "<ul>$1</ul>");

  return formattedHTML;
}
