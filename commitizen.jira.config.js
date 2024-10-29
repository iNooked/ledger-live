const custom = require("@digitalroute/cz-conventional-changelog-for-jira/configurable");

module.exports = custom({
  skipScope: false,
  scopes: ["LLM", "LLD", "libs", "all"],
  jiraPrefix: "LIVE",
});
