const { Octokit } = require("@octokit/rest");

async function addIssueToColumn(columnName, issueNumber, octokit) {
  try {
    // Get the project ID
    const projects = await octokit.projects.listForRepo({
      owner: process.env.OWNER,
      repo: process.env.REPO,
    });
    const projectId = projects.data[0].id;

    // Get the column ID by column name
    const columns = await octokit.projects.listColumns({
      project_id: projectId,
    });
    const columnId = columns.data.find((c) => c.name === columnName).id;

    // Add the issue to the column
    await octokit.projects.createCard({
      column_id: columnId,
      issue_number: issueNumber,
    });
  } catch (error) {
    console.error(`Error adding issue to column: ${error}`);
    throw error;
  }
}

module.exports = addIssueToColumn;