import React, {useContext } from 'react';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import { Box, TextField, MenuItem, Button, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import api from '../Admin/api/axios';
import { AuthContext } from '../context/AuthProvider';

const validationSchema = Yup.object({
  summary: Yup.string().required('Summary is required'),
  priority: Yup.string().oneOf(['High', 'Average', 'Low'], 'Invalid priority').required('Priority is required'),
});

const JiraTicketForm = ({ collectionName, pageLink }) => {

  const {auth} = useContext(AuthContext);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/api/tickets', {
        summary: values.summary,
        priority: values.priority,
        collectionName,
        pageLink,
        userEmail: auth.email,
      });
      toast.success('Ticket created successfully!');
      console.log('Ticket link:', response.data.jiraUrl);
    } catch (error) {
      toast.error('Failed to create ticket');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ summary: '', priority: 'Low' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box mb={2}>
            <Field
              name="summary"
              as={TextField}
              label="Summary"
              variant="outlined"
              fullWidth
              required
              helperText={<ErrorMessage name="summary" component="div" />}
              error={!!errors.summary && touched.summary}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="priority"
              as={TextField}
              select
              label="Priority"
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Average">Average</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Field>
            <ErrorMessage name="priority" component="div" />
          </Box>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Create Ticket'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default JiraTicketForm;
