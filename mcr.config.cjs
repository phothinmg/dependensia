module.exports = {
  name: "dependensia",
  outputDir: "test-coverage",
  reports: [["codecov"]],
  entryFilter: {
    "**/node_modules/**": false,
    "**/src/**": true,
  },
};
