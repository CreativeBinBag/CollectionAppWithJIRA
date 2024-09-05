import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Typography, useTheme, Button,  List, ListItem, ListItemText } from '@mui/material';
import { tokens } from '../../../theme';
import api from '../../../Admin/api/axios';


const ItemTable = ({tagId}) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [items, setItems] = useState([]);
  const [collectionCustomFields, setCollectionCustomFields] = useState({});
  useEffect(() => {
    const fetchItems = async (tagId) => {
      if (!tagId || tagId === 'null' || tagId === 'undefined') {
        console.error('Invalid or null tagId:', tagId);
        setItems([]);
        setCollectionCustomFields({});
        return;
      }
  
      try {
        const response = await api.get(`/api/item-tags/${tagId}/taggedItems`);
        setItems(response.data.items);
        setCollectionCustomFields(response.data.collectionCustomFields || {});
      } catch (error) {
        console.error('Failed to fetch items by tag', error);
        setItems([]);
        setCollectionCustomFields({});
      }
    };
  
    // Ensure the fetch only runs when tagId is valid
    if (tagId) {
      fetchItems(tagId);
    }
  }, [tagId]);
  
  
   const columns = [
    { field: 'name', headerName: 'Item Name',   headerAlign: 'center',
      align: 'center',  flex: 1, minWidth: 150 },
    ...Object.entries(collectionCustomFields)
      .filter(([key]) => key.endsWith('_name'))
      .map(([key, name]) => ({
        field: key.replace('_name', '_value'),
        headerName: name,
        headerAlign: 'center',
        align: 'center',
        flex: 1, minWidth: 150
      })),
    { field: 'userName', headerName: 'Added by',   headerAlign: 'center',
      align: 'center', flex: 1, minWidth: 150 },
  ];
  

  const rows = items.map(item => {
    if (!item.Collection || !item.Collection.User) return null;
  
    return {
      id: item.id,  // Ensure each row has a unique ID
      name: item.name,
      userName: item.Collection.User.userName,
      ...Object.entries(item)
        .filter(([key, value]) => key.endsWith('_value') && value != null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    };
  }).filter(row => row !== null); // Filter out null rows

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '65vh',
      overflowX: 'auto',
      width: '100%',
      borderRadius: '8px', // Round the corners of the container
        overflow: 'hidden', // Hide any overflowed content to maintain rounded corners
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Optional: Add a shadow for better aesthetics
    }} >
    <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        
        sx={{  
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#546e7a',
                color: colors.greenAccent[300],
                minWidth: 150,
              },
            
              '& .MuiDataGrid-columnHeaderDraggable': {
                pointerEvents: 'none', // Disables column dragging
              },
            
            '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.blueAccent[700], 
               borderRight: `1px solid ${colors.primary[300]}`,
              },
            
            '& .MuiDataGrid-footerContainer': { backgroundColor: colors.blueAccent[700] },
            '& .MuiDataGrid-root': {
              borderRadius: '8px', // Round the corners of the DataGrid
              overflow: 'hidden', // Hide any overflowed content to maintain rounded corners
             
            }

        } }
    />
</Box>
 
  )
}

export default ItemTable
