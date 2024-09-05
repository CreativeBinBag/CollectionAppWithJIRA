import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Dialog, DialogTitle, DialogContent, Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../../theme';
import api from '../../api/axios';
import { AuthContext } from '../../../context/AuthProvider';


const CommentBox = ({ itemId, dialogOpen, setDialogOpen, onCommentCountChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {t} = useTranslation();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [itemId]);

  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(commentCount);
    }
  }, [commentCount]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/comments/${itemId}/get`);
      setComments(response.data);
      setCommentCount(response.data.length); // Update the comment count based on fetched data
      
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };


  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  

  const handleSubmitComment = async () => {
    try {
      if (editingComment) {
        await api.put(`/api/comments/${editingComment.id}/update`, { text: newComment });
        setEditingComment(null);
      } else {
        await api.post('/api/comments', { text: newComment, itemId, userId: auth.id });
        setCommentCount(prevCount => prevCount + 1);
      }
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setNewComment(comment.text);
  };

  const handleDeleteComment = async (id) => {
    try {
      await api.delete(`/api/comments/${id}/delete`);
      setCommentCount(prevCount => prevCount - 1);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: colors.greenAccent[600], fontSize: 20 }}>
      </DialogTitle>
      <DialogContent>
        
        <TextField
        label={t('writeAcomment')}
        value={newComment}
        onChange={handleCommentChange}
        fullWidth
        margin="normal"
      />

        <Button variant="contained" sx={{ backgroundColor: colors.greenAccent[800] }} onClick={handleSubmitComment}>
          {editingComment ? (t('updateComment')) : (t('addComment'))}
        </Button>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <ListItemText primary={<Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" component="span" sx={{ marginRight: '8px', fontWeight: "bold", color: colors.blueAccent[600]}}>
              {comment.User.userName}
            </Typography>
            <Typography variant="body2" component="span">
              {comment.text}
            </Typography>
          </Box>} />
          {auth.id === comment.User.id && (
          <>
            <Button startIcon={<EditOutlinedIcon />}variant="contained" sx={{marginRight: "8px"}} onClick={() => handleEditComment(comment)}>{t('edit')}</Button>
            <Button startIcon={<DeleteIcon />}variant="contained" sx={{backgroundColor: colors.redAccent[500] }} onClick={() => handleDeleteComment(comment.id)}>{t('delete')}</Button>
          </> )}
              
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default CommentBox;