const { createJiraTicket } = require('./jiraController');

const generateTicket = async (req, res) => {
  const { summary, priority, collectionName, pageLink, userEmail } = req.body;

  try {
    const ticket = await createJiraTicket(summary, priority, collectionName, pageLink, userEmail);
    return res.json({ jiraUrl: `${process.env.JIRA_BASE_URL}/browse/${ticket.key}` });
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
}


module.exports = {generateTicket}