import React from 'react';
import { Dialog, DialogTitle, DialogContent, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../../theme';
import { useTranslation } from 'react-i18next';

const ViewItemDialog = ({ open, onClose, itemDetails, customFields }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
            sx: {
                width: '400px',
                maxHeight: '100vh',
                borderRadius: '12px',
                padding: '10px',
            }
        }}>
            <DialogTitle sx={{ color: colors.greenAccent[600], fontSize: 20 }}>{t('itemDetails')}</DialogTitle>
            <DialogContent sx={{ padding: '16px' }}>
                {itemDetails && (
                    <Card sx={{ padding: 2, borderRadius: "10px", backgroundColor: colors.blueAccent[800] }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                            {itemDetails.name}
                        </Typography>
                        {customFields
                            .filter(field => itemDetails[field.field] !== null && itemDetails[field.field] !== undefined)
                            .map(field => (
                                <Typography key={field.field} variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {field.headerName || field.field.replace(/_/g, ' ')}: {itemDetails[field.field]}
                                </Typography>
                            ))}
                        {itemDetails.associatedTags && (
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {t('tags')}: {itemDetails?.associatedTags?.map(tag => tag.name).join(', ')}
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {t('createdAt')}: {new Date(itemDetails?.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {t('lastUpdated')}:  {new Date(itemDetails?.updatedAt).toLocaleString()}
                        </Typography>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ViewItemDialog;
