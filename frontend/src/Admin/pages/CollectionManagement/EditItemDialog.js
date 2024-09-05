import React from 'react'
import { Dialog, DialogTitle, DialogContent} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../../theme';
import { useTranslation } from 'react-i18next';
import EditItemForm from './EditItemForm';

const EditItemDialog = ({ open, onClose, itemId, customFields, collectionItems }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();

  // Filter custom fields based on whether they are used in any item within the collection
  const filteredCustomFields = customFields.filter(field => 
      collectionItems.some(item => item[field.field] !== null && item[field.field] !== undefined)
  );

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: colors.greenAccent[600], fontSize: 20 }}>{t('editItemDetails')}</DialogTitle>
          <DialogContent>
              {itemId && <EditItemForm itemId={itemId} onClose={onClose} customFields={filteredCustomFields} />}
          </DialogContent>
      </Dialog>
  );
};

export default EditItemDialog
