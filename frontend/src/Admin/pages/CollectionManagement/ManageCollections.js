import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent} from '@mui/material';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Visibility from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Header from '../../components/Header';
import api from '../../api/axios';
import EditCollectionForm from './EditCollectionForm'; 
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import CreateTicketButton from '../../../JIRA/CreateTicketButton';

const ManageCollections = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {t} = useTranslation();

  const [collections, setCollections] = useState([]);
  const [editCollectionId, setEditCollectionId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  const [selectedCollection, setSelectedCollection] = useState(null); 
 

  const navigate = useNavigate();
 
    const getCollections = async () => {
      try {
        const { data } = await api.get('/api/collections/get');
        setCollections(data.map((collection) => ({ ...collection, id: collection.id })));
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };


  useEffect(() => {
    getCollections();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if(action==='view'){
        navigate(`/api/collections/${id}/view`);
      }
      else if (action === 'edit') {
        setEditCollectionId(id);
        setDialogOpen(true);
      } else if (action === 'delete') {

        setCollectionToDelete(id);
        setConfirmDeleteOpen(true);
       
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleRowSelection = (params) => {
    const selectedRow = collections.find((collection) => collection.id === params.id);
    if (selectedRow) {
      setSelectedCollection({
        collectionName: selectedRow.name,
        pageLink: `/collections/${selectedRow.id}/view`
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
        await api.delete(`/api/collections/${collectionToDelete}/delete`);
        setCollections(collections.filter((collection) => collection.id !== collectionToDelete));
        setConfirmDeleteOpen(false);
    } catch (error) {
        console.error('Error deleting collection:', error);
    }
};



  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditCollectionId(null);
    setConfirmDeleteOpen(false);
    setCollectionToDelete(null);
    getCollections(); // Refresh the collection data

  };

  const columns = [
    { field: 'name', headerName: t('name'), flex: 0.5, },
    { field: 'description', headerName: t('description'), flex: 0.5 },
    { field: 'categoryId', headerName: t('category'), headerAlign: 'center', align: 'center', flex: 0.5 },
    { field: 'userName', headerName: t('username'), headerAlign: 'center', align: 'center', flex: 0.5 },
    {
      field: 'actions',
      headerName: t('actions'),
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={() => handleAction(row.id, 'view')}
            >
              {t('view')}
            </Button>
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => handleAction(row.id, 'edit')}
            >
              {t('edit')}
            </Button>
            <Button
             sx={{
              backgroundColor: colors.redAccent[500]
            }}
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => handleAction(row.id, 'delete')}
            >
              {t('delete')}
            </Button>
            <Button
               variant="contained"
               startIcon={<PostAddOutlinedIcon />}
               onClick={() => navigate(`/api/items/${row.id}/create`)}
            >
              {t('newItem')}
            </Button>
          </Stack>
        </Box>
      )
    }
  ];

  return (
    <Box m="8px" position="fixed" width= "80%">
      <Header title= {t('collectionsList')}subtitle={t('manageCollectionsofallUsers')} />
      <Box m="40px 0 0 0" height="70vh" sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none"
        },
        "& .MuiDataGrid-colummHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none"
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400]
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700]
        },
      }}>
        <DataGrid rows={collections} columns={columns} pageSize={10} rowsPerPageOptions={[10]} onRowClick={handleRowSelection} checkboxSelection />
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle
           sx={{
            color: colors.greenAccent[600],
            fontSize: 20,
          }}>
            {t('editCollectionDetails')}
            </DialogTitle>
        <DialogContent   >
          {editCollectionId && (
            <EditCollectionForm
              collectionId={editCollectionId}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      
      </Dialog>
      <ConfirmDeleteDialog open={confirmDeleteOpen} onClose={handleDialogClose} onConfirm={handleDeleteConfirm} />

      {/* Create Ticket Button */}
      <Box position="fixed" bottom="30px" right="16px"> 
      {selectedCollection && (
        <CreateTicketButton
          collectionName={selectedCollection.collectionName}
          pageLink={selectedCollection.pageLink}
        />
      )}
    </Box>
    </Box>
  );
};

export default ManageCollections;

