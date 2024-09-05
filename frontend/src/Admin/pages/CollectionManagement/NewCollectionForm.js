import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Button, FormLabel } from '@mui/material';
import { tokens } from '../../../theme';
import MDEditor from '@uiw/react-md-editor';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const categories = ["Books", "Signs", "Silverware", "Others"]; // Replace with actual category IDs
const customFieldTypes = ["string", "int", "bool", "text", "date"];

const getTypeCounters = (customFields) => {
  const typeCounters = { string: 0, int: 0, bool: 0, text: 0, date: 0 };
  customFields.forEach(field => {
    if (typeCounters[field.type] !== undefined) {
      typeCounters[field.type]++;
    }
  });
  return typeCounters;
};

const validationSchema = Yup.object({
  name: Yup.string().required('Collection name is required'),
  userId: Yup.string().required('User ID is required'),
  description: Yup.string().required('Description is required'),
  imageUrl: Yup.string().url('Invalid URL').nullable(),
  categoryId: Yup.string().oneOf(categories, 'Invalid category').required('Category is required'),
  customFields: Yup.array().of(
    Yup.object({
      type: Yup.string().oneOf(customFieldTypes).required(),
      state: Yup.string().oneOf(['NOT_PRESENT', 'PRESENT_OPTIONAL', 'PRESENT_REQUIRED']).required(),
      name: Yup.string().nullable(),
    })
  )
  .default([]),
});

const NewCollectionForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { t } = useTranslation();
  const [warning, setWarning] = useState('');
  const [typeCounters, setTypeCounters] = useState({ string: 0, int: 0, bool: 0, text: 0, date: 0 });

  const resetCustomFields = (setFieldValue, type, values) => {
    // Filter out fields of the type that exceeds the limit
    const filteredFields = values.customFields.filter(field => field.type !== type);
    setFieldValue('customFields', filteredFields);
    setTypeCounters(prevCounters => ({ ...prevCounters, [type]: 0 }));
  };
  
  const handleSubmit = async (values, { resetForm, setFieldValue }) => {
    try {
      // Custom validation logic
      const currentCounters = getTypeCounters(values.customFields);
      const exceedsLimitType = Object.keys(currentCounters).find(type => currentCounters[type] > 3);
  
      if (exceedsLimitType) {
        setWarning(`You cannot have more than three fields of type ${exceedsLimitType}.`);
        resetCustomFields(setFieldValue, exceedsLimitType, values); // Pass values here
        return; // Prevent submission
      }
  
      setWarning(''); // Clear warning if valid
  
      const transformedCustomFields = {};
      const updatedCounters = { ...typeCounters };

      values.customFields.forEach((field) => {
        const type = field.type;
        const count = updatedCounters[type] + 1; // Simulate counter increment for this iteration

        if (count > 3) return; // Skip this field if the count exceeds the limit

        const keyPrefix = `custom_${type}${count}_`;
        transformedCustomFields[`${keyPrefix}state`] = field.state;
        if (field.state !== 'NOT_PRESENT') {
          transformedCustomFields[`${keyPrefix}name`] = field.name || null;
        }

        updatedCounters[type] = count; // Update the counter after processing
      });

      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl,
        userId: values.userId,
        categoryId: values.categoryId,
        ...transformedCustomFields, // Include custom fields
      };

      console.log("Final Payload to Send:", payload);

      // Make the API request
      const response = await api.post('/api/collections/create', payload);
      console.log('Collection created:', response.data);
      resetForm();
      setTypeCounters({ string: 0, int: 0, bool: 0, text: 0, date: 0 }); // Reset counters after submission

    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('createNewCollection')}
      </Typography>
      <Formik
        initialValues={{
          name: '',
          userId: '',
          description: '',
          imageUrl: '',
          categoryId: '',
          customFields: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <Box  
              sx={{
                mb: 2,
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}>

              <Field
                sx={{ backgroundColor: colors.blueAccent[900] }}
                as={TextField}
                name="name"
                label={t('collectionName')}
                fullWidth
                variant="filled"
                margin="normal"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                sx={{ backgroundColor: colors.blueAccent[900] }}
                as={TextField}
                name="userId"
                label={t('userId')}
                fullWidth
                variant="filled"
                margin="normal"
                error={!!touched.userId && !!errors.userId}
                helperText={touched.userId && errors.userId}
              />
              <Field
                sx={{ backgroundColor: colors.blueAccent[900] }}
                as={TextField}
                name="imageUrl"
                label={t('imageURLtext')}
                fullWidth
                variant="filled"
                margin="normal"
                error={!!touched.imageUrl && !!errors.imageUrl}
                helperText={touched.imageUrl && errors.imageUrl}
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>{t('category')}</InputLabel>
                <Field
                  sx={{ backgroundColor: colors.greenAccent[800] }}
                  as={Select}
                  name="categoryId"
                  label={t('category')}
                  inputProps={{ 'aria-label': 'Category' }}
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage name="categoryId" component="div" />
              </FormControl>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" marginTop="20px" fontSize="16px">{t('description')}</Typography>
                <Field name="description">
                  {({ field }) => (
                    <MDEditor
                      value={field.value}
                      onChange={(value) => setFieldValue('description', value)}
                      height={300}
                    />
                  )}
                </Field>
                <ErrorMessage name="description" component="div" />
              </Box>

            {/* Custom Fields Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">{t('customFieldsHeader')}</Typography>
              {values.customFields.map((field, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                     <FormControl fullWidth margin="normal">
                      <InputLabel></InputLabel>
                      <Field
                        as={Select}
                        name={`customFields.${index}.type`}
                        label={t('fieldType')}
                        inputProps={{ 'aria-label': 'Field Type' }}
                      >
                        <MenuItem value="string">{t('text')}</MenuItem>
                        <MenuItem value="int">{t('number')}</MenuItem>
                        <MenuItem value="bool">{t('yesno')}</MenuItem>
                        <MenuItem value="text">{t('largeText')}</MenuItem>
                        <MenuItem value="date">{t('date')}</MenuItem>
                      </Field>
                      <ErrorMessage name={`customFields.${index}.type`} component="div" />
                    </FormControl>

                    <Field
                      sx={{ backgroundColor: colors.blueAccent[800] }}
                      as={TextField}
                      name={`customFields.${index}.name`}
                      label={t('customFieldName', { index: index + 1 })}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      error={!!touched.customFields?.[index]?.name && !!errors.customFields?.[index]?.name}
                      helperText={touched.customFields?.[index]?.name && errors.customFields?.[index]?.name}
                      disabled={field.state === 'NOT_PRESENT'}
                    />
                    <Box sx={{ mb: 2 }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}> {t('fieldState')}</FormLabel>
                        <RadioGroup
                          name={`customFields.${index}.state`}
                          value={field.state}
                          onChange={(e) => setFieldValue(`customFields.${index}.state`, e.target.value)}
                          sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
                        >
                          <FormControlLabel
                            value="NOT_PRESENT"
                            control={<Radio sx={{ color: 'grey.500', '&.Mui-checked': { color: 'grey.700' } }} />}
                            label={<Typography variant="body2">{t('hidden')}</Typography>}
                          />
                          <FormControlLabel
                            value="PRESENT_OPTIONAL"
                            control={<Radio sx={{ color: 'warning.main', '&.Mui-checked': { color: 'warning.dark' } }} />}
                            label={<Typography variant="body2">{t('optional')}</Typography>}
                          />
                          <FormControlLabel
                            value="PRESENT_REQUIRED"
                            control={<Radio sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.dark' } }} />}
                            label={<Typography variant="body2">{t('required')}</Typography>}
                          />
                        </RadioGroup>
                        <ErrorMessage name={`customFields.${index}.state`} component="div" style={{ color: 'red', marginTop: '0.5rem' }} />
                      </FormControl>
                    </Box>
                </Box>
              ))}

              {/* Warning Message */}
              {warning && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {warning}
                </Typography>
              )}

              <Button
                sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.greenAccent[200], borderColor: colors.greenAccent[700] }}
                variant="outlined"
                onClick={() => {
                  const newField = { type: 'string', state: 'NOT_PRESENT', name: '' };
                  const currentCounters = getTypeCounters(values.customFields);
                  const type = newField.type;
              
                  if (currentCounters[type] < 3) {
                    setFieldValue('customFields', [...values.customFields, newField]);
                  } else {
                    setWarning(`You cannot have more than three fields of type ${type}.`);
                    resetCustomFields(setFieldValue, type, values); // Clear custom fields of the same type
                  }
                }}
              >
                <AddCircleOutlinedIcon />
                {t('addCustomField')}
              </Button>
            </Box>

            <Button
              type="submit"
              variant="outlined"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.greenAccent[200], borderColor: colors.greenAccent[700] }}
            >
              <SaveIcon sx={{ color: colors.grey[100] }} />
              {t('createCollection')}
            </Button>

          </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewCollectionForm;