const axios = require("axios");

async function addIssueToColumn(octokit, columnName, issueNumber) {
  // Get the repository name and owner from context
  const { repository } = context.payload;
  const owner = repository.owner.login;
  const repo = repository.name;

  // Get the project ID
  const projects = await octokit.projects.listForRepo({ owner, repo });
  const projectId = projects.data[0].id;

  // Get the column ID by column name
  const columns = await octokit.projects.listColumns({ project_id: projectId });
  const columnId = columns.data.find((c) => c.name === columnName).id;

  // Add the issue to the column
  await octokit.projects.createCard({
    column_id: columnId,
    content_id: issueNumber,
    content_type: "Issue",
  });
}

module.exports = addIssueToColumn;
