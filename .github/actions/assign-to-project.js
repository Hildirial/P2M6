const { GitHub } = require("@actions/github");

async function run() {
  try {
    const context = GitHub.context;
    if (context.payload.label.name !== "bug") {
      console.log("This issue doesn't have the correct label");
      return;
    }
    const octokit = new GitHub(process.env.GITHUB_TOKEN);
    await octokit.projects.createCard({
      column_id: 1,
      content_id: context.payload.issue.id,
      content_type: "Issue",
    });
    console.log("Issue successfully assigned to the project");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
