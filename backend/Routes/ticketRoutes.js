const express = require('express');
const { generateTicket } = require('../controller/jiraTicketController')
const { getUserTickets } = require('../controller/jiraController');
const { authenticateUser } = require('../Middleware/privileges');
const router = express.Router();

router.post('/tickets', generateTicket);
router.get('/tickets/user', getUserTickets)

module.exports = router;
