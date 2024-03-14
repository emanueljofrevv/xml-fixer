/* -------------------------------------------------------------------------- */
/*                              GLOBAL REPORT MAP                             */
/* -------------------------------------------------------------------------- */

const report = new Map();

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function addToReport(key, value) {
  if (!report.has(key)) {
    report.set(key, [value]);
  } else {
    const reportedField = report.get(key);
    reportedField.push(value);
  }
}

function clearReport() {
  report.clear();
}

function generateReport(data) {
  let markdown = ``;

  data.forEach((value, key) => {
    // Add the subheader
    markdown += `${key}\n`;
    value.forEach((msg, i) => {
      if (msg) {
        // Add the message
        markdown += `${i + 1}. ${msg}\n`;
      } else {
        console.log();
      }
    });
  });

  return markdown;
}

module.exports = {
  addToReport,
  report,
  clearReport,
  generateReport,
};
