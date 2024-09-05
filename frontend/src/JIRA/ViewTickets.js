import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, List, ListItem, ListItemText, Box, Link } from '@mui/material';
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
      <Typography variant="h6" gutterBottom>
        Your Jira Tickets
      </Typography>
      <List>
        {tickets.map(ticket => (
          <ListItem key={ticket.id}>
            <ListItemText
              primary={
                <Link 
                  href={`https://collectionest.atlassian.net/browse/${ticket.key}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{
                    color: 'lightblue', // More visible in dark mode
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'white', // Change on hover for better contrast
                    },
                    '&:focus': {
                      outline: '2px solid white', // Focus effect
                    },
                  }}
                >
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
