import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import { Button, TextField, Stack, Box, Typography, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, FormHelperText, useTheme  } from '@mui/material';
import { tokens } from '../../../theme';
import { Formik, Field, Form} from 'formik';
import * as Yup from 'yup';
import TagInput from '../../components/TagInput';
import api from '../../api/axios';

const NewItemForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customFields, setCustomFields] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const [validationSchema, setValidationSchema] = useState(Yup.object());

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        const response = await api.get(`/api/collections/${id}/get`);
        const { customFields } = response.data;
        const filteredFields = customFields.filter(field => field.state !== 'NOT_PRESENT');
        setCustomFields(filteredFields);

        // Group fields by type
        const groupedFields = filteredFields.reduce((acc, field) => {
          acc[field.type] = acc[field.type] || [];
          acc[field.type].push(field);
          return acc;
        }, {});

        // Create validation schema
        const schema = Object.keys(groupedFields).reduce((acc, fieldType) => {
          groupedFields[fieldType].forEach((field, index) => {
            const fieldKey = `custom_${field.type}${index + 1}_value`;
            if (field.state === 'PRESENT_REQUIRED') {
              acc[fieldKey] = Yup.string().required(`${field.name || field.type} is required`);
            } else if (field.state === 'PRESENT_OPTIONAL') {
              acc[fieldKey] = Yup.string().nullable();
            }
          });
          return acc;
        }, {});

        setValidationSchema(Yup.object(schema));

      } catch (error) {
        console.error('Error fetching collection details:', error);
      }
    };

    fetchCollectionDetails();
  }, [id]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        tags: [],
        ...Object.keys(customFields.reduce((acc, field) => {
          acc[field.type] = acc[field.type] || [];
          acc[field.type].push(field);
          return acc;
        }, {})).reduce((acc, fieldType) => {
          customFields.filter(f => f.type === fieldType).forEach((field, index) => {
            const fieldKey = `custom_${field.type}${index + 1}_value`;
            acc[fieldKey] = field.state === 'PRESENT_OPTIONAL' ? null : '';
          });
          return acc;
        }, {})
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await api.post(`/api/items/${id}/create`, {
            ...values,
            collectionId: id,
          });
          console.log('Item created successfully');
          resetForm();
          navigate(`/api/collections/${id}/view`);
        } catch (error) {
          console.error('Error creating item:', error);
        }
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form>
          <Button onClick={() => navigate('/manage-collections')} variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: colors.greenAccent[700] }}>
            Back
          </Button>
          <Stack spacing={3} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Typography variant="h5" sx={{ color: colors.greenAccent[600], fontSize: 30 }}>Create New Item</Typography>

            <Field sx={{ backgroundColor: colors.primary[400] }}
              as={TextField}
              fullWidth
              label="Item Name"
              name="name"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <TagInput sx={{ backgroundColor: colors.primary[400] }}
              itemId={''}
              onTagsUpdated={(tags) => setFieldValue('tags', tags)}
              initialTags={initialTags}
            />

            {Object.keys(customFields.reduce((acc, field) => {
              acc[field.type] = acc[field.type] || [];
              acc[field.type].push(field);
              return acc;
            }, {})).map(fieldType => (
              customFields.filter(f => f.type === fieldType).map((field, index) => (
                <Box key={`${field.type}_${index}`} sx={{ mb: 2 }}>
                  {field.type === 'string' && (
                    <Field sx={{ backgroundColor: colors.primary[400] }}
                      as={TextField}
                      fullWidth
                      label={field.name || 'String Field'}
                      name={`custom_${field.type}${index + 1}_value`}
                      error={touched[`custom_${field.type}${index + 1}_value`] && Boolean(errors[`custom_${field.type}${index + 1}_value`])}
                      helperText={touched[`custom_${field.type}${index + 1}_value`] && errors[`custom_${field.type}${index + 1}_value`]}
                    />
                  )}

                  {field.type === 'int' && (
                    <Field sx={{ backgroundColor: colors.primary[400] }}
                      as={TextField}
                      fullWidth
                      label={field.name || 'Integer Field'}
                      name={`custom_${field.type}${index + 1}_value`}
                      type="number"
                      error={touched[`custom_${field.type}${index + 1}_value`] && Boolean(errors[`custom_${field.type}${index + 1}_value`])}
                      helperText={touched[`custom_${field.type}${index + 1}_value`] && errors[`custom_${field.type}${index + 1}_value`]}
                    />
                  )}

                  {field.type === 'bool' && (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{field.name || 'Boolean Field'}</FormLabel>
                      <RadioGroup
                        name={`custom_${field.type}${index + 1}_value`}
                        value={values[`custom_${field.type}${index + 1}_value`] || ''}
                        onChange={(e) => {
                          setFieldValue(`custom_${field.type}${index + 1}_value`, e.target.value)
                        }}
                      >
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                      <FormHelperText>
                        {touched[`custom_${field.type}${index + 1}_value`] && errors[`custom_${field.type}${index + 1}_value`]}
                      </FormHelperText>
                    </FormControl>
                  )}

                  {field.type === 'text' && (
                    <Field sx={{ backgroundColor: colors.primary[400] }}
                      as={TextField}
                      fullWidth
                      label={field.name || 'Text Field'}
                      name={`custom_${field.type}${index + 1}_value`}
                      multiline
                      rows={4}
                      error={touched[`custom_${field.type}${index + 1}_value`] && Boolean(errors[`custom_${field.type}${index + 1}_value`])}
                      helperText={touched[`custom_${field.type}${index + 1}_value`] && errors[`custom_${field.type}${index + 1}_value`]}
                    />
                  )}

                  {field.type === 'date' && (
                    <Field sx={{ backgroundColor: colors.primary[400] }}
                      as={TextField}
                      fullWidth
                      label={field.name || 'Date Field'}
                      name={`custom_${field.type}${index + 1}_value`}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={touched[`custom_${field.type}${index + 1}_value`] && Boolean(errors[`custom_${field.type}${index + 1}_value`])}
                      helperText={touched[`custom_${field.type}${index + 1}_value`] && errors[`custom_${field.type}${index + 1}_value`]}
                    />
                  )}
                </Box>
              ))
            ))}

            <Button type="submit" variant="outlined"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '50px', color: colors.greenAccent[200], borderColor: colors.greenAccent[700], '&:hover': { backgroundColor: colors.greenAccent[800], borderColor: colors.greenAccent[800], color: colors.primary[200] }, }}
            >
              Create Item
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default NewItemForm;
