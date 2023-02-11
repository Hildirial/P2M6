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
      auth: 'secrets.GITHUB_TOKEN'
    })

    await octokit.issues.create({
      owner: core.getInput('repo-owner'),
      repo: core.getInput('repo-name'),
      title: `Bug: ${issueTitle}`,
      body: `Issue #${core.getInput('issue-number')} has been labeled as a bug. Please add to Bugs.`,
      labels: ['Bugs']
    });

    core.debug(`Issue created in Bugs repository.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
