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

module.exports = {
  addToReport,
  report,
  clearReport,
};
