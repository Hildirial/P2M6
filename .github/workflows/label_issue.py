from github import Github
import os

# Initialize the Github client using an access token
access_token = "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"
g = Github(access_token)

# Get the repository
repo_name = os.environ["Hildirial"]
username, reponame = repo_name.split("/")
repo = g.get_user(username).get_repo(reponame)

# Get the issue by its number
issue_number = int(os.environ[GITHUB_EVENT_NUMBER])
issue = repo.get_issue(issue_number)

# Get the labels of the issue
labels = issue.get_labels()

# Check if the issue has a specific label
for label in labels:
    if label.name == "bug":
        # Get the project by its name
        project = repo.get_project("Bugs")
        # Get the column by its name
        column = project.get_column("To Do")
        # Move the issue to the project
        column.move_issue(issue)
        break
