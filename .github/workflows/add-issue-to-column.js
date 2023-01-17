const axios = require('axios');

async function addIssueToColumn(columnName) {
  // Get the project ID
  const project = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/projects`);
  const projectId = project.data[0].id;

  // Get the column ID by column name
  const column = await axios.get(`https://api.github.com/projects/${projectId}/columns?per_page=100`);
  const columnId = column.data.find(c => c.name === columnName).id;

  // Add the issue to the column
  await axios.post(`https://api.github.com/projects/columns/${columnId}/cards`, {
    content_id: ISSUE
