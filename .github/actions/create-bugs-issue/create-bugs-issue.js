const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {
  try {
    // Récupérer le token de dépôt en utilisant la fonction `core.getInput`
    const repoToken = core.getInput('repo-token');

    // Initialiser Octokit avec le token de dépôt
    const octokit = new Octokit({
      auth: repoToken
    });

    // Récupérer le nom de l'étiquette
    const label = github.context.payload.label.name;

    // Si l'étiquette n'est pas "bug", terminer le script
    if (label !== 'bug') {
      core.debug(`Label is not "bug". No action taken.`);
      return;
    }

    // Récupérer le titre de la demande
    const issueTitle = github.context.payload.issue.title;

    // Créer une nouvelle demande avec le titre "Bug: [titre original de la demande]"
    await octokit.issues.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      title: `Bug: ${issueTitle}`,
      body: `Issue #${github.context.payload.issue.number} has been labeled as a bug. Please add to Bugs.`,
      labels: ['Bugs']
    });

    // Afficher un message de débogage
    core.debug(`Issue created in Bugs repository.`);
  } catch (error) {
    // Définir l'erreur
    core.setFailed(error.message);
  }
}

run();
