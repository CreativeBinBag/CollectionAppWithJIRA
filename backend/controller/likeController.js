const db = require('..');
const {Like,Item} = db;

//Add like to an item

const addLike = async (req, res) => {
 
    const {itemId} = req.params;
    const {userId} = req.body;

    if (!itemId || !userId) {
      return res.status(400).json({ message: 'Item ID or User ID is missing.' });
    }
  try{

    const likedAlready = await Like.findOne({
      where: {itemId, userId}
    })

    if(likedAlready){
      return res.status(400).json({message: 'User has already liked this item.'});
    }

    const like = await Like.create({itemId, userId});
    await Item.increment('likesCount', { by: 1, where: { id: itemId } });
    return res.status(201).json(like);
  }catch(error){
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).send('Internal Server Error');
    }
  }
};


//remove like from item

const removeLike = async (req, res) => {
  const {itemId} = req.params;
  const {userId} = req.body;
  if (!itemId || !userId) {
    return res.status(400).json({ message: 'Item ID or User ID is missing.' });
  }
  try{
   
    const like = await Like.findOne({where: {itemId, userId}});
    if(!like) return res.status(404).send('No likes found');

    await like.destroy();
    await Item.decrement('likesCount', { by: 1, where: { id: itemId } });
    return res.status(200).json({ message: 'Like removed successfully.' });

  }catch(error){
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).send('Internal Server Error');
    }
  }
}

const checkUserLikes = async (req, res) => {
  
    const {itemId} = req.params;
    const {userId} = req.query;

    if (!itemId || !userId) {
      return res.status(400).json({ message: 'Item ID or User ID is missing.' });
    }

    try{
    const like = await Like.findOne({
      where: {itemId, userId}
    })
 
    return res.status(200).json({liked: !!like});
  }catch(error){
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = { addLike, removeLike, checkUserLikes };
