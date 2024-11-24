module.exports = {
  default: [
    "--publish-quiet",
    "--format progress",
    "--format json:reports/cucumber-report.json",
  ].join(" "),
  web: [
    "--require features/web/**/*.js",
    "--format progress",
    "--format json:reports/cucumber-report.json",
  ].join(" "),
  mobile: [
    "--require features/mobile/**/*.js",
    "--format progress",
    "--format json:reports/cucumber-report.json",
  ].join(" "),
};
