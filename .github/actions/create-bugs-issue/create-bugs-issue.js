const core = require('@actions/core');
const { GitHub } = require('@actions/github');

async function run() {
  try {
    const github = new GitHub(core.getInput('repo-token'));
    const label = github.context.payload.label.name;
    if (label !== 'bug') {
      core.debug(`Label is not "bug". No action taken.`);
      return;
    }

    const issueTitle = github.context.payload.issue.title;

    await octokit.issues.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      title: `Bug: ${issueTitle}`,
      body: `Issue #${github.context.payload.issue.number} has been labeled as a bug. Please add to Bugs.`,
      labels: ['Bugs']
    });

    core.debug(`Issue created in Bugs repository.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
