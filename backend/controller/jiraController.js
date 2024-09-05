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
      notification: "true",
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

//Jira Ticket generation


const createJiraTicket = async (summary, priority, collectionName, pageLink) => {
  const jiraUrl = process.env.JIRA_BASE_URL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const authHeader = Buffer.from(`${process.env.JIRA_EMAIL}:${apiToken}`).toString('base64');

  try {
    const response = await axios.post(`${jiraUrl}/rest/api/3/issue`, {
      fields: {
        project: {
          key: 'CMS001' 
        },
        summary: summary,
        description: `Collection: ${collectionName}\nLink: ${pageLink}`,
        issuetype: {
          name: 'Support Ticket'  // Ensure this issue type exists
        },
        priority: {
          name: priority
        },
        //jira will manage status field based on workflow transitions
      }
    }, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;  // Return ticket data to display it in the app
  } catch (error) {
    console.error('Error creating Jira ticket:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create Jira ticket');
  }
};



const getUserTickets = async (req, res) => {
  const userEmail = req.user.email; // Get current user email from authentication context

  try {
    const response = await axios.get(`${jiraUrl}/rest/api/3/search?jql=reporter="${userEmail}"`, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });
    return res.json(response.data.issues);  // Return array of tickets
  } catch (error) {
    console.error('Error fetching Jira tickets:', error);
    return res.status(500).json({ error: 'Failed to fetch Jira tickets' });
  }
};




module.exports = { createJiraUser, createJiraTicket, getUserTickets };
