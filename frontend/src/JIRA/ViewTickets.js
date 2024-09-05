import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, List, ListItem, ListItemText, Box, Link, Card, CardContent, useTheme } from '@mui/material';
import { tokens } from '../theme';
import api from '../Admin/api/axios';

const ViewTickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        padding: 3 
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 800, boxShadow: 3, backgroundColor: colors.primary[400] }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
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
                        color: '#1976d2', 
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#115293', 
                        },
                        '&:focus': {
                          outline: '2px solid #115293', 
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewTickets;
