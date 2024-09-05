import * as React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { tokens } from '../../../theme'
import api from '../../api/axios'
import { Box, Chip} from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; 
import { useTheme } from '@emotion/react'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LikeTheItem from './LikeTheItem'
import CommentBox from './CommentBox'
import './homefeed.css'

const HomeFeed = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [items, setItems] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentCounts, setCommentCounts] = useState({}); 
  const location = useLocation();

  useEffect(() =>{
    const fetchItemDetails = async() => {
      try{
        const response = await api.get('/api/items/itemsForFeed');
        setItems(response.data);

      }catch(error){
        console.log('Error fetching items', error);
      }
    }

    fetchItemDetails();

  },[])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const highlightedItemId = queryParams.get('highlightedItem');
    if (highlightedItemId) {
      setTimeout(() => {
        const element = document.getElementById(highlightedItemId);
  
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlighted');
          setTimeout(() => {
            element.classList.remove('highlighted');
          }, 3000);
        } else {
          console.log('Element with ID not found.');
        }
      }, 500); 
    }
  }, [location, items]);


  const handleIconClick = (id) => {
    if (activeCommentBox === id) {
        // Close the dialog if the same icon is clicked again
        setActiveCommentBox(null);
        setDialogOpen(false);
    } else {
        // Open the dialog for the clicked item
        setActiveCommentBox(id);
        setDialogOpen(true);
    }
};

const handleCommentCountChange = (itemId, count) => {
  setCommentCounts(prevCounts => ({ ...prevCounts, [itemId]: count }));
};


  if (!items.length) {
    return <Typography variant="h6" color= {colors.redAccent[700]}>No items available.</Typography>;
  }
  
    return (

      <Box padding={10} marginLeft={30}>
      
      {items.map((item) => (

                <Card key={item.id} id={item.id}
                sx={{
                  width: { xs: "80vw", sm: "40vw", md: "30vw", lg: "30vw" },
                  borderRadius: '5%',
                  height: "65vh",
                  backgroundColor: colors.primary[400],
                  mb: 4
                  
                }}
                >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: colors.primary[400] }} aria-label="">
                      U
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontSize: '1.5rem', color: colors.blueAccent[100] }}>
                      {item.Collection.User.userName}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                  }
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={item.Collection.imageUrl}
                  
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div" fontSize="1.25rem" fontWeight="bold" color={colors.greenAccent[200]}>
                  {item.name}
                </Typography>
                <Typography gutterBottom variant="body2" component="div" fontSize="0.9rem" color={colors.greenAccent[200]}>
                  {item.Collection.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                 {item.associatedTags?.slice(0, 4).map((tag) =>(
                             <Chip 
                             key={tag.id || tag.name}
                             label={tag.name}
                             icon={<LocalOfferIcon />}
                             sx={{
                              backgroundColor: colors.primary[400],
                              color: colors.greenAccent[400],
                              padding: '5px 5px', 
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              margin: '2px',
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
                             }}
                             
                             />
                 ))}
                </Typography>
                  
                </CardContent>
                <CardActions sx={{ p: '0px 15px' }}> 
                                        <LikeTheItem itemId={item.id} />
                                        <IconButton aria-label="comment" onClick={() => handleIconClick(item.id)}>
                                        <ChatBubbleOutlineIcon />
                                        <Typography variant="caption" sx={{ marginLeft: '4px' }}>
                                        {commentCounts[item.id] || 0}
                                      </Typography>
                                        </IconButton>
                                        {activeCommentBox === item.id && (
                                          <CommentBox
                                            itemId={item.id}
                                            dialogOpen={dialogOpen}
                                            setDialogOpen={setDialogOpen}
                                            onCommentCountChange={(count) => handleCommentCountChange(item.id, count)}
                                          />
                                        )}
  
                        </CardActions>

                        </Card>

      ))}
    </Box>
    
    )
  
  
}

export default HomeFeed
