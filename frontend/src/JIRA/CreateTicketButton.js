import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import JiraTicketForm from './JiraTicketForm';

const CreateTicketButton = ({ collectionName, pageLink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Support Ticket
      </Button>
      <Dialog open={isModalOpen} onClose={handleClose} fullWidth>
        <DialogTitle>Create Jira Ticket</DialogTitle>
        <DialogContent>
          <JiraTicketForm collectionName={collectionName} pageLink={pageLink} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateTicketButton;
