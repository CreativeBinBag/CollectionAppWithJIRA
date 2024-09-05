import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Button, FormLabel } from '@mui/material';
import { tokens } from '../../../theme';
import { useTheme} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {Alert} from '@mui/material';
import api from '../../api/axios';

const categories = ["Books", "Signs", "Silverware", "Others"]; // Replace with actual category IDs

const EditCollectionForm = ({ collectionId, onClose }) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  
  const [collection, setCollection] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [typeCounters, setTypeCounters] = useState({ string: 0, int: 0, bool: 0, text: 0, date: 0 });
  const [warningMessage, setWarningMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const { data } = await api.get(`/api/collections/${collectionId}/get`);
        console.log('Fetched collection:', data); 
        setCollection(data);
        setName(data.name);
        setDescription(data.description);
        setCategoryId(data.categoryId);
        setImageURL(data.imageUrl);
        setCustomFields(data.customFields || []);

        // Initialize type counters
        const counters = { string: 0, int: 0, bool: 0, text: 0, date: 0 };
        data.customFields.forEach(field => {
          if (field.type) counters[field.type]++;
        });
        setTypeCounters(counters);
      } catch (error) {
        console.error('Error fetching collection:', error);
      }
    };

    fetchCollection();
  }, [collectionId]);

  const handleCustomFieldChange = (index, field, value) => {
    setCustomFields(prevFields => {
      const newCustomFields = [...prevFields];
      newCustomFields[index] = {
        ...newCustomFields[index],
        [field]: value,
      };
      return newCustomFields;
    });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'myCloud');

    setIsUploading(true);

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dhz1vnxjt/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;

    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

  const transformedCustomFields = {};
  const newTypeCounters = { string: 0, int: 0, bool: 0, text: 0, date: 0 };

  customFields.forEach((field) => {
    const type = field.type;
    if (newTypeCounters[type] >= 3) {
      setWarningMessage(`Cannot have more than 3 ${type} fields.`);
      return;
    }
    const index = newTypeCounters[type] + 1;

    const keyPrefix = `custom_${type}${index}_`;
    transformedCustomFields[`${keyPrefix}state`] = field.state;
    if (field.state !== 'NOT_PRESENT') {
      transformedCustomFields[`${keyPrefix}name`] = field.name || null;
    }

    newTypeCounters[type]++;
  });

  const updateData = { name, description, categoryId, ...transformedCustomFields };

  if (imageURL) {
    updateData.imageUrl = imageURL;
  }

  console.log('Update data before API call:', updateData);

  try {
    const response = await api.put(`/api/collections/${collection.id}/update`, updateData);
    console.log('API response:', response.data);
    onClose();
  } catch (error) {
    console.error('Error updating collection:', error.response ? error.response.data : error.message);
  }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const url = await handleImageUpload(file);
        setImageURL(url);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  };

  const handleAddCustomField = () => {
    const newCustomFields = [...customFields];
    const newTypeCounters = { ...typeCounters };
    const validTypes = ['string', 'int', 'bool', 'text', 'date'];
    
    const newFieldType = 'string'; // Adjust this based on user selection or other logic

    if (!validTypes.includes(newFieldType)) {
      console.error(`Invalid field type: ${newFieldType}`);
      return;
    }

    if (newTypeCounters[newFieldType] >= 3) {
      setWarningMessage(`Cannot add more than 3 ${newFieldType} fields.`);
      return;
    }

    const index = newTypeCounters[newFieldType] + 1;

    newCustomFields.push({ type: newFieldType, state: 'NOT_PRESENT', name: `custom_${newFieldType}${index}` });
    newTypeCounters[newFieldType]++;

    setCustomFields(newCustomFields);
    setTypeCounters(newTypeCounters);
  };

  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => {
        setWarningMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage]);

  if (!collection) return <Typography>{t('Loading...')}</Typography>;

  return (
    <Box>
      <TextField
        label={t('name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <MDEditor
        value={description}
        onChange={setDescription}
        height={200}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>{t('category')}</InputLabel>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          display: 'flex',
          p: 2,
          border: '1px solid #ddd',
          borderRadius: 2,
          width: 'fit-content',
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
        />
        {imageURL && (
          <Box sx={{ display: 'flex' }}>
            <img
              src={imageURL}
              alt="Preview"
              style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover' }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2, mt: 2 }}>
        <Typography variant="h6">{t('customFieldsHeader')}</Typography>
        {customFields.map((field, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('fieldType')}</InputLabel>
              <Select
                value={field.type}
                onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
              >
                <MenuItem value="string">{t('text')}</MenuItem>
                <MenuItem value="int">{t('number')}</MenuItem>
                <MenuItem value="bool">{t('yesno')}</MenuItem>
                <MenuItem value="text">{t('largeText')}</MenuItem>
                <MenuItem value="date">{t('date')}</MenuItem>
              </Select>
            </FormControl>

            <TextField sx={{ backgroundColor: colors.primary[400] }}
              label={t('customFieldName', { index: index + 1 })}
              value={field.name || ''}
              onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={field.state === 'NOT_PRESENT'}
            />
            <Box sx={{ mb: 2 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{t('fieldState')}</FormLabel>
                <RadioGroup
                  name={`customFields.${index}.state`}
                  value={field.state}
                  onChange={(e) => handleCustomFieldChange(index, 'state', e.target.value)}
                  sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
                >
                  <FormControlLabel
                    value="NOT_PRESENT"
                    control={<Radio sx={{ color: 'grey.500', '&.Mui-checked': { color: 'grey.700' } }} />}
                    label={<Typography variant="body2">{t('hidden')}</Typography>}
                  />
                  <FormControlLabel
                    value="PRESENT_OPTIONAL"
                    control={<Radio sx={{ color: 'blue.500', '&.Mui-checked': { color: 'blue.700' } }} />}
                    label={<Typography variant="body2">{t('optional')}</Typography>}
                  />
                  <FormControlLabel
                    value="PRESENT_REQUIRED"
                    control={<Radio sx={{ color: 'green.500', '&.Mui-checked': { color: 'green.700' } }} />}
                    label={<Typography variant="body2">{t('required')}</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        ))}

        {warningMessage && (
          <Typography color="error">{warningMessage}</Typography>
         )}   

        <Button
          onClick={handleAddCustomField}
          disabled={Object.values(typeCounters).every(count => count >= 3)}
          variant="contained"
          color="primary"
        >
          {t('addCustomField')}
        </Button>
    
      </Box>

           
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isUploading}>
        {t('save')}
        </Button>
        <Button onClick={onClose} color="primary" variant="contained" style={{ marginLeft: '10px' }}>
        {t('cancel')}  </Button>
      </Box>
    </Box>
  );
};

export default EditCollectionForm;
