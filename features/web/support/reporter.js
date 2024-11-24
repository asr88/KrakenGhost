const reporter = require("multiple-cucumber-html-reporter");
const fs = require("fs");
const path = require("path");

// Ensure reports directory exists
const reportsDir = path.join(__dirname, "../../../reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Generate report only if JSON file exists
const jsonFile = path.join(reportsDir, "cucumber-report.json");
if (fs.existsSync(jsonFile)) {
  reporter.generate({
    jsonDir: reportsDir,
    reportPath: "./reports/cucumber-html-report/",
    metadata: {
      browser: {
        name: "chrome",
        version: "96",
      },
      device: "Local test machine",
      platform: {
        name: "windows",
        version: "10",
      },
    },
    customData: {
      title: "Run info",
      data: [
        { label: "Project", value: "Ghost Testing" },
        { label: "Release", value: "1.0.0" },
        { label: "Execution Start Time", value: new Date().toISOString() },
        { label: "Execution End Time", value: new Date().toISOString() },
      ],
    },
  });
}
