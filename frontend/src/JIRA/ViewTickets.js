import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import api from '../Admin/api/axios';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/tickets/user');  // Implement this endpoint
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
    <div>
      <Typography variant="h4" gutterBottom>Your Jira Tickets</Typography>
      <List>
        {tickets.map(ticket => (
          <ListItem key={ticket.id}>
            <ListItemText
              primary={ticket.fields.summary}
              secondary={`Status: ${ticket.fields.status.name}`}
            />
            <ListItemIcon>
              <IconButton
                edge="end"
                color="primary"
                href={`${process.env.REACT_APP_JIRA_BASE_URL}/browse/${ticket.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNewIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ViewTickets;
