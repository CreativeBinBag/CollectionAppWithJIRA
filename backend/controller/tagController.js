const db = require('..');
const {Tag, Item} = db;

//create new tag
const createTag = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the tag already exists
    const existingTag = await Tag.findOne({ where: { name } });

    if (existingTag) {
      // Return the existing tag
      return res.status(200).json(existingTag);
    }

    // Create a new tag if it doesn't exist
    const newTag = await Tag.create({ name });
    res.status(201).json(newTag);

   
  }catch(error){
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

//get all tags, including all associated items

const getTags = async(req, res) =>{
  try{
    const tags = await Tag.findAll();
    res.status(200).json(tags);

  }catch(error){
    console.error('Error fetching tags:', error.message);
    console.error('Stack trace:', error.stack); // Log stack trace for more details
    res.status(500).send(`Internal server error: ${error.message}`);
  }
}

//get a single tag

const getTagById = async(req, res) =>{
  try{
    const tag = await Tag.findByPk(req.params.id, {
      include: Item, //include associated items
    });
    if (!tag) return res.status(404).send('Tag not found');
    res.status(200).json(tag);
  }catch(error){
    console.error(error);
    res.status(500).send('Error fetching tag');
  }
}

//search tag
const searchTags = async (req, res) => {
  try {
    const { query } = req.query; 
    if (!query) return res.status(400).send('Query parameter is required');

    const tags = await Tag.findAll({
      where: {
        name: {
          [Op.iLike]: `${query}%` // Use case-insensitive matching for PostgreSQL
        }
      }
    });

    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


//Update a tag

const updateTag = async(req, res) =>{
  try{
    const { id } = req.params;
    const { name } = req.body;

    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).send('Tag not found');

    await tag.update({ name });
    res.status(200).json(tag);
    
  }catch(error){
    console.error(error);
    res.status(500).send('Error updating tag');
  }
}

//Delete a tag

const deleteTag = async(req, res) =>{
  try{
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).send('Tag not found');

    await tag.destroy();
    res.status(204).send();
  }catch(error){
    console.error(error);
    res.status(500).send('Internal server error');
  }
};



module.exports = {createTag, getTags, getTagById, updateTag, deleteTag, searchTags};