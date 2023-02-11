const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

console.log(`repo-owner: ${core.getInput('repo-owner')}`);
console.log(`repo-name: ${core.getInput('repo-name')}`);
console.log(`repo-token: ${core.getInput('repo-token')}`);

async function run() {
  try {
    const label = core.getInput('label-name');
    if (label !== 'bug') {
      core.debug(`Label is not "bug". No action taken.`);
      return;
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Obtenir les colonnes du projet "Bugs"
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

    // Obtenir la colonne "À faire"
    const toDoColumn = columns.find(column => column.name === 'To Do');
    if (!toDoColumn) {
      core.debug(`No column named "To Do" found in project "Bugs". No action taken.`);
      return;
    }

    // Ajouter la carte de l'issue dans la colonne "À faire"
    await octokit.projects.createCard({
      column_id: toDoColumn.id,
      content_id: core.getInput('issue-number'),
      content_type: 'Issue'
    });

    core.debug(`Issue added to the "To Do" column in the "Bugs" project.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();