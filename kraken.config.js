module.exports = {
  testFiles: "features/**/*.feature",
  helpers: {
    DataGenerator: {
      require: "./features/web/helpers/data-generator.js",
    },
  },
  output: "./reports/kraken",
  format: ["progress", "json:reports/kraken-report.json"],
  timeout: 30000,
  retry: 0,
};
