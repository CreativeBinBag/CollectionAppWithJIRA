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

const createJiraTicket = async (summary, priority, collectionName, pageLink, userEmail) => {
  const jiraUrl = process.env.JIRA_BASE_URL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const authHeader = Buffer.from(`${process.env.JIRA_EMAIL}:${apiToken}`).toString('base64');

  try {
    // First, fetch the Jira accountId for the user based on their email
    const userResponse = await axios.get(`${jiraUrl}/rest/api/3/user/search?query=${userEmail}`, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });

    const userAccountId = userResponse.data[0]?.accountId;  // Assuming user exists and accountId is returned
    
    if (!userAccountId) {
      throw new Error('User not found in Jira');
    }

    // Now create the Jira ticket with the assignee
    const response = await axios.post(`${jiraUrl}/rest/api/3/issue`, {
      fields: {
        project: {
          key: 'CMS001'
        },
        summary: summary,
        description: {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": `Collection: ${collectionName}\nLink: ${pageLink}`,
                  "type": "text"
                }
              ]
            }
          ]
        },
        issuetype: {
          name: 'Support Ticket'
        },
        priority: {
          name: priority // Ensure priority is properly formatted
        },
        assignee: {
          accountId: userAccountId // Assign the issue to the user by their Jira accountId
        }
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
  const userEmail = req.user.email;
  console.log('Current User Email', userEmail);
  const jiraUrl = process.env.JIRA_BASE_URL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const authHeader = Buffer.from(`${process.env.JIRA_EMAIL}:${apiToken}`).toString('base64');

  try {
   
    const response = await axios.get(`${jiraUrl}/rest/api/3/search?jql=reporter="${encodeURIComponent(userEmail)}"`, {

      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if issues exist
    if (response.data.issues && response.data.issues.length > 0) {
      return res.json(response.data.issues);  // Return array of tickets
    } else {
      return res.json([]);  // Return an empty array if no tickets were found
    }
  } catch (error) {
    console.error('Error fetching Jira tickets:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to fetch Jira tickets' });
  }
};




module.exports = { createJiraUser, createJiraTicket, getUserTickets };
