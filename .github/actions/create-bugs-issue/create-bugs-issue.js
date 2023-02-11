const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {
  try {
   
    const label = core.getInput('label-name');
    if (label !== 'bug') {
      core.debug(`Label is not "bug". No action taken.`);
      return;
    }

    const issueTitle = core.getInput('issue-title');
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })

    // Get project columns for project 'Bugs'
    const projectResponse = await octokit.projects.listForRepo({
      owner: core.getInput('repo-owner'),
      repo: core.getInput('repo-name'),
      state: 'open'
    });
    const project = projectResponse.data.find(p => p.name === 'Bugs');
    if (!project) {
      core.debug(`No project named "Bugs" found. No action taken.`);
      return;
    }
    const columnsResponse = await octokit.projects.listColumns({
      project_id: project.id
    });
    const columns = columnsResponse.data;

    // Get the column 'To Do'
    const toDoColumn = columns.find(column => column.name === 'To Do');
    if (!toDoColumn) {
      core.debug(`No column named "To Do" found in project "Bugs". No action taken.`);
      return;
    }

    // Create the issue and add it to the 'To Do' column
    const issue = await octokit.issues.create({
      owner: core.getInput('repo-owner'),
      repo: core.getInput('repo-name'),
      title: `Bug: ${issueTitle}`,
      body: `Issue #${core.getInput('issue-number')} has been labeled as a bug. Please add to Bugs.`,
      labels: ['Bugs']
    });
    await octokit.projects.createCard({
      column_id: toDoColumn.id,
      content_id: issue.data.id,
      content_type: 'Issue'
    });

    core.debug(`Issue created in Bugs repository and added to the "To Do" column.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
