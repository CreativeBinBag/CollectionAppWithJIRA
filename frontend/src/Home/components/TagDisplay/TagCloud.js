import React, { useEffect, useState, useMemo } from 'react';
import { Box, Chip, Typography, useTheme, Button,  List, ListItem, ListItemText } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; 
import { tokens } from '../../../theme';
import api from '../../../Admin/api/axios';
import ItemTable from './ItemTable';
import { useTranslation } from 'react-i18next';


const TagCloud = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {t} = useTranslation();
  const[tags, setTags] = useState([]);
  const [showTagCount, setShowTagCount] = useState(10);
  const [selectedTagId, setSelectedTagId] = useState(null); 



  useEffect(() =>{

    const fetchTags = async() => {
      try{
        const response = await api.get('/api/tags/get');
        setTags(response.data);
        
      }catch(error){
        console.error('Failed to fetch tags', error)
      }
    }
    fetchTags()
  }, [])

  const handleShowMore = () => {
    setShowTagCount(prevCount => prevCount + 10);
  }

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId);
  }

  const selectedTagName = tags.find(tag => tag.id === selectedTagId)?.name || '';

  return (
    <Box 
    sx={{
      width: '100%',
      pb: '20px',
      mt: '5vh',
      overflow: 'hidden',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1, 
      justifyContent: 'center'
    }}
  >
    {tags.slice(0, showTagCount).map((tag) => (
      <Chip
        key={tag.id || tag.name}
        label={tag.name}
        icon = {<LocalOfferIcon />}
        onClick={() => handleTagClick(tag.id)}
        sx={{
          backgroundColor: colors.primary[400],
          color: colors.greenAccent[400],
          padding: '8px 16px', 
          fontWeight: 'bold',
          fontSize: '14px',
          margin: '4px',
          '&:hover': {
            transform: 'scale(1.2)', 
            color: colors.greenAccent[500], 
            boxShadow: `0px 4px 12px ${colors.primary[200]}`,
          },
          '& .MuiChip-icon': {
            transition: 'color 0.3s ease-in-out',
          },
          '&:hover .MuiChip-icon': {
            color: colors.greenAccent[600],
          },
          cursor: 'pointer'
        }}
      />
    ))}
   {tags.length > showTagCount && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleShowMore}
            sx={{
              borderRadius: '10px',
              border: '1px solid grey',
              backgroundColor: colors.blueAccent[800],
              '&:hover': {
                borderColor: colors.primary[300],
                color: colors.primary[300],
              },
            }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center', color: colors.primary[200] }}>
            {t('showMore')}

            </Typography>
          </Button>
        </Box>
      )}
   

      <Box sx={{padding: 3}}>
      {selectedTagId && (
          <>
            <Typography variant="h5" sx={{ textAlign: 'center', color: colors.grey[200], mb: 2, p:2, fontSize: '25px' }}>
            Items with the tag:  <strong>{selectedTagName}</strong>
            </Typography>
            <ItemTable tagId={selectedTagId} />
          </>
        )}

      </Box>

  </Box>
  )
}

export default TagCloud
