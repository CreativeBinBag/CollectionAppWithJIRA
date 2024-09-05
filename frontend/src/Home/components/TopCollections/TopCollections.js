import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Typography, useTheme, IconButton, Avatar } from '@mui/material';
import { CardContent } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { tokens } from '../../../theme';
import api from '../../../Admin/api/axios';

const TopCollections = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {t} = useTranslation();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadCollections= async () => {
      try {
        const response= await api.get('/api/collections/top-collections');
        setCollections(response.data);
      } catch (error) {
        console.error('Failed to get top collections', error);
      }
    };

    loadCollections();
  }, []);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Box sx={{ width: '100%', mt: "5vh", overflow: 'hidden' }}>
       <Typography variant="h5" sx={{ ml: 4,fontWeight: 'bold', fontSize: "30px", color: colors.primary[300] }}>
        {t('topFiveLargestCollection')}
                </Typography>
      
      <Carousel responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={2000}
        infinite={true}
        arrows={false} 
        customTransition="transform 0.5s ease-in-out" 
        transitionDuration={500} >
        {collections.length > 0 ? (
          collections.map((collection) => (
            <Card key={collection.id} sx={{ padding: 2, width: { xs: "80vw", sm: "40vw", md: "30vw", lg: "20vw" }, borderRadius: '5%', boxShadow: `0px 4px 12px ${colors.primary[300]}`, m: 2, height: "50vh", backgroundColor: colors.primary[400] }}>
              <CardContent sx={{ textAlign: 'center' }}>
              <Avatar src={collection.image} sx={{ width: 150, height: 150,  borderRadius: '12px', mx: 'auto' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 20, mt: 2, color: colors.grey[100] }}>
                  {collection.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: "16px", mt:1, mb: 1, color: colors.greenAccent[400] }}>
                  Added by: {collection.author|| 'Unknown'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "14px", color: colors.grey[200], lineHeight: 1.5 }}>
                  Created at: {collection.created || 'Unknown'}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 2, color: colors.redAccent[600]}}>No collections available.</Typography>
        )}
      </Carousel>
    </Box>
  );
};

export default TopCollections;
