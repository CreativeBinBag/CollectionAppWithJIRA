import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, List, ListItem, ListItemText } from '@mui/material';
import api from '../Admin/api/axios';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets/user'); 
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
    <Typography variant="h6">Your Jira Tickets</Typography>
    <List>
      {tickets.map(ticket => (
        <ListItem key={ticket.id}>
          <ListItemText
            primary={
              <Link href={`${process.env.REACT_APP_JIRA_BASE_URL}/browse/${ticket.key}`} target="_blank" rel="noopener noreferrer">
                {ticket.fields.summary}
              </Link>
            }
            secondary={ticket.fields.status.name}
          />
        </ListItem>
      ))}
    </List>
  </Box>
  );
};

export default ViewTickets;
