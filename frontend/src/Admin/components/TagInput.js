import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, TextField, Chip, Stack, Button, useTheme} from '@mui/material';
import api from '../api/axios';
import { tokens } from '../../theme';


const TagInput = ({ itemId, onTagsUpdated, initialTags }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    
    const fetchTags = async () => {
      try {
        const response = await api.get('/api/tags/get');
        setTagOptions(response.data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  
  }, []);

  useEffect(() => {
    if (initialTags) {
      setSelectedTags(initialTags);
    }
  }, [initialTags]);
  
  const handleTagAdd = async () => {
    const trimmedTag = newTag.trim().toLowerCase(); // Normalize to lowercase
    if (trimmedTag === '') return;
  
    try {
      const tagExistsInOptions = tagOptions.some(tag => tag.name.toLowerCase() === trimmedTag);
      if (!tagExistsInOptions) {
        const response = await api.post('/api/tags/create', { name: trimmedTag });
        const createdTag = response.data;
        setTagOptions(prev => [...prev, createdTag]);
      }
   //avoid duplicate tags associated with an item
      setSelectedTags(prev => {
        const tagExistsInSelected = prev.some(tag => tag.name.toLowerCase() === trimmedTag);
        if (!tagExistsInSelected) {
          return [...prev, { name: trimmedTag }];
        }
        return prev;
      });
  
      setNewTag('');
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };
  
  

  const handleTagChange = (event, newValue) => {
    const validTags = (newValue || [])
      .filter(tag => tag)
      .map(name => ({ name: name.trim().toLowerCase() })); // Normalize to lowercase
    setSelectedTags(validTags);
    onTagsUpdated(validTags.map(tag => tag.name));
  };
  
    

  return (
    <Box>
       <Autocomplete
            multiple
            freeSolo
            options={tagOptions.map((option) => option.name || '')}
            value={selectedTags.map((tag) => tag.name || '')}
            onChange={(event, newValue) => handleTagChange(event, newValue)}
            renderTags={(value, getTagProps) =>
              (value || []).map((option, index) => {
                if (option === undefined) return null; // Skip undefined values
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip sx={{backgroundColor: colors.primary[400], color: colors.greenAccent[400], fontWeight: "bold", fontSize: "14px"}}
                key={key} label={option} {...tagProps} />;
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Enter tags"
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd(); // Add the tag when 'Enter' is pressed
                  }
                }}
              />
            )}
          />
 
       <Button variant="outlined" 
            sx={{ display: 'flex', mt: 2, justifyContent: 'center', gap: 1, height: '40px', color: colors.greenAccent[200], borderColor: colors.greenAccent[700], borderRadius: 10, '&:hover': {backgroundColor: colors.greenAccent[800], borderColor: colors.greenAccent[800],color: colors.grey[200]}, }}onClick={handleTagAdd}>
              Add Tag
              
      </Button>
     
    </Box>
     
    
  );
};

export default TagInput;
