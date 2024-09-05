const axios = require('axios');

const createJiraUser = async (email, displayName, password) => {
  const jiraUrl = process.env.JIRA_BASE_URL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const authHeader = Buffer.from(`${process.env.JIRA_EMAIL}:${apiToken}`).toString('base64');

  try {
    const response = await axios.post(`${jiraUrl}/rest/api/3/user`, {
      emailAddress: email,
      displayName: displayName,
      password: password 
    }, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.accountId;  // Store this in your database linked to the user
  } catch (error) {
    console.error('Error creating Jira user:', error);
    throw new Error('Failed to create Jira user');
  }
};

module.exports = { createJiraUser };
