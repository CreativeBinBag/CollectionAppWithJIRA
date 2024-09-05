import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Typography, useTheme, IconButton } from '@mui/material';
import { FavoriteBorderOutlined, CommentOutlined } from '@mui/icons-material';
import { CardContent } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { tokens } from '../../../theme';
import api from '../../../Admin/api/axios';

const RecentItem = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {t} = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const recentItems = await api.get('/api/items/getRecent?limit=5');
        setItems(recentItems.data);
      } catch (error) {
        console.error('Failed to get recent items', error);
      }
    };

    loadItems();
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
    <Box sx={{ width: '100%', mt: "10vh",overflow: 'hidden' }}>
       <Typography variant="h5" sx={{ ml: 4,fontWeight: 'bold', fontSize: "30px", color: colors.primary[300] }}>
       {t('latestItems')}

                </Typography>
      
      <Carousel responsive={responsive}>
        {items.length > 0 ? (
          items.map((item) => (
            <Card key={item.id} sx={{ padding: 2, width: { xs: "80vw", sm: "40vw", md: "30vw", lg: "20vw" }, borderRadius: '10%', boxShadow:`0px 4px 12px ${colors.primary[300]}`, m: 2, height: "auto", backgroundColor: colors.blueAccent[900] }}>
              <CardContent sx={{alignItems: "center"}}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 20, mt: 2, color: colors.grey[100] }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: "16px", mt:1, mb: 1, color: colors.greenAccent[400] }}>
                  Collection: {item.Collection?.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "14px", color: colors.grey[300]}}>
                  Added by: {item.Collection?.User?.userName || 'Unknown'}
                </Typography>
              </CardContent>
              <Box justifyContent="space-between" alignItems="center" sx={{ mt: 2, ml:2 }}>
                <IconButton aria-label="like">
                  <FavoriteBorderOutlined sx={{ color: colors.grey[100] }} />
                </IconButton>
                <IconButton aria-label="comment">
                  <CommentOutlined sx={{ color: colors.grey[100] }} />
                </IconButton>
              </Box>
            </Card>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 2, color: colors.redAccent[600]}}>No recent items available.</Typography>
        )}
      </Carousel>
    </Box>
  );
};

export default RecentItem;
