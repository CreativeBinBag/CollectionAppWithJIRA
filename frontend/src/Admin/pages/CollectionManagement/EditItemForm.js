import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../../api/axios';
import TagInput from '../../components/TagInput';

const EditItemForm = ({ itemId, customFields, onClose }) => {
  const [item, setItem] = useState(null);
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [fieldValues, setFieldValues] = useState({});


  useEffect(() => {
          const fetchItem = async () => {
            try {
              const { data } = await api.get(`/api/items/${itemId}/get`);
              console.log('Fetched item:', data);
              setItem(data);
              setName(data.name);
              console.log("fetched tags", data.associatedTags);
        
              const initialTags = (data.associatedTags || []).map(tag => ({ name: tag.name.trim().toLowerCase()}));
              console.log("initial tags", initialTags);
              setSelectedTags(initialTags);
        
              const initialFieldValues = {};
              customFields.forEach(field => {
                if (data[field.field] !== null && data[field.field] !== undefined) {
                  initialFieldValues[field.field] = data[field.field];
                }
              });
              setFieldValues(initialFieldValues);
              console.log('Initial field values:', initialFieldValues);
        
            } catch (error) {
              console.error('Error fetching item:', error);
            }
          };
        
          fetchItem();
        }, [itemId, customFields]);
        


 
        const handleFieldChange = (field, value) => {
          setFieldValues(prev => ({ ...prev, [field]: value }));
        };
      

        const handleTagsUpdated = (updatedTags) => {
          console.log("Updated Tags", updatedTags);
          setSelectedTags(updatedTags.map(tag => ({ name: tag.trim().toLowerCase() })));
        };
        
        const handleSubmit = async (event) => {
          event.preventDefault();
        
          try {
            const tags = selectedTags.map(tag => tag.name.toLowerCase());
            const updateData = { name, tags, ...fieldValues };
            const response = await api.put(`/api/items/${item.id}/update`, updateData);
            console.log('Response from API:', response.data);
            onClose();
          } catch (error) {
            console.error('Error updating Item:', error.response ? error.response.data : error.message);
          }
        };
        
  
  if (!item) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
   
       <TagInput
        itemId={itemId}
        onTagsUpdated={handleTagsUpdated}
        initialTags={selectedTags} // Provide initial tags for editing
      />

       {customFields.map((field) => (
        <TextField
        
         key={field.field}
         label={field.headerName || field.field.replace(/_/g, ' ')}
         value={fieldValues[field.field] || ''}
         onChange={(e) => handleFieldChange(field.field, e.target.value)}
         fullWidth
         margin="normal"
        
        />
       ))}
    
     
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
        <Button onClick={onClose} color="primary" variant="contained" style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditItemForm;







