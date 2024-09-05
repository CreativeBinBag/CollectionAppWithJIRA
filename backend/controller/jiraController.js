const axios = require('axios');

const createJiraUser = async (email, displayName) => {
  const jiraUrl = process.env.JIRA_BASE_URL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const authHeader = Buffer.from(`${process.env.JIRA_EMAIL}:${apiToken}`).toString('base64');

  try {
    // Create Jira user
    const userResponse = await axios.post(`${jiraUrl}/rest/api/3/user`, {
      emailAddress: email,
      displayName: displayName,
      products: ["jira-servicedesk", "jira-software"] // Ensure the user has product access
    }, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });

    const accountId = userResponse.data.accountId;  // Store this in your database linked to the user

    // Add the user to the group 'jira-users-collectionest'
    await axios.post(`${jiraUrl}/rest/api/3/group/user?groupname=jira-users-collectionest`, {
      accountId: accountId
    }, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });

    return accountId;
  } catch (error) {
    console.error('Error creating Jira user or adding to group:', error);
    throw new Error('Failed to create Jira user or add to group');
  }
};

module.exports = { createJiraUser };
