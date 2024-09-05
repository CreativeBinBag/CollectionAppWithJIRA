import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@mui/material'
import api from '../../api/axios';
import { tokens } from '../../../theme';
import {IconButton, Typography, useTheme} from '@mui/material';
import { Favorite} from '@mui/icons-material';
import { FavoriteBorder} from '@mui/icons-material';
import { AuthContext } from '../../../context/AuthProvider';



const LikeTheItem = ({itemId}) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const {auth} = useContext(AuthContext)

  useEffect(() => {

    const fetchItemLikes = async() => {
      try{
        const item = await api.get(`/api/items/${itemId}/get`)
        setLikesCount(item.data.likesCount);

        const userLiked = await api.get(`/api/likes/${itemId}/checkLikes`, {
          params: {userId: auth.id}
        })

        setLiked(userLiked.data.liked);
      }catch(error){
        console.error('Error fetching data', error)
      }
    }
 
     fetchItemLikes()

  }, [itemId, auth])

  const handleLikes = async () => {
    try{
      if(liked){
        await api.delete(`/api/likes/${itemId}/unlike`, {data: {userId : auth.id}})
        setLikesCount(likesCount - 1);
      }else{
        await api.post(`/api/likes/${itemId}/like`, {userId: auth.id});
        setLikesCount(likesCount+1)

      }
      setLiked(!liked)

    }catch(error){

      console.error('Error liking/unliking item:', error);

    }
  }
  
  return (
    <Box display="flex" alignItems="center" >
      <IconButton onClick={handleLikes}>
        {liked ? <Favorite sx={{ color: colors.redAccent[500] }} /> : <FavoriteBorder sx={{ color: 'default'}}/>}
      </IconButton>
      <Typography variant="body2">{likesCount}</Typography>
    </Box>
  )
}

export default LikeTheItem
