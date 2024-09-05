const db = require('..');
const {Comment, User} = db;

// add a new comment

const createComment = async (req, res) => {
  try{
    const {text, itemId, userId} = req.body;
    const comment = await Comment.create({text, itemId, userId});
    res.status(201).json(comment);
  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

//get all comments for an item

const getComments = async (req, res) => {
  try{
    const {itemId} = req.params;
    const comments = await Comment.findAll({
      where: {itemId},
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'userName']
      }
      ]
    
    })
    res.status(200).json(comments);

  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//get a single comment

const getCommentById = async (req, res) => {
      const {id} = req.params

  try{
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).send('Comment not found');
    res.status(200).json(comment);

  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//update/edit a comment

const updateComment = async(req, res) => {
  try{
    const {id} = req.params;
    const{text} = req.body
    const comment = await Comment.findByPk(id);
    if(!comment) return res.status(404).send('Comment not found');

    await comment.update({text});
    res.status(200).json(comment);

  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).send('Comment not found');

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { createComment, getComments, getCommentById, updateComment, deleteComment };