const db = require('..')
const {Item, Tag, Collection, User} = db;

//create new item

const createItem = async (req, res) => {
  const { name, tags, ...customFields } = req.body;

  try {
    // 1. Check and create tags
    const tagInstances = await Promise.all(
      tags.map(async (tag) => {
        const [tagInstance] = await Tag.findOrCreate({
          where: { name: tag},
        });

        return tagInstance;
      })
    );
 
    console.log('Tag Instances:', tagInstances); // Debugging

    // 2. Create the item
    const newItem = await Item.create({
      name,
      ...customFields,
      collectionId: req.params.id,
    });

    console.log('New Item:', newItem); // Debugging


    // 3. Associate tags with the item
    await newItem.addAssociatedTags(tagInstances);
    const associatedTags = await newItem.getAssociatedTags();
    console.log('Associated Tags:', associatedTags); // Debugging


    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};


// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


//Get one item
const getItemById = async (req, res) => {
  try{
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: Tag, as: 'associatedTags' }]
    })
  
    if(!item) return res.status(404).send('Item Not Found');
    res.status(201).json(item);

    console.log("View Item Deets", item)
  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//update an item

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tags, ...customFields } = req.body;

    // get the existing item
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).send('Item Not Found');

    // find or create tag instances
    const tagInstances = await Promise.all(
      tags.map(async (tag) => {
        const [tagInstance] = await Tag.findOrCreate({
          where: { name: tag },
        });
        return tagInstance;
      })
    );

    // update item details
    await item.update({
      name,
      ...customFields
    });

    // now get current associated tags
    const currentTags = await item.getAssociatedTags();
    const currentTagNames = currentTags.map(tag => tag.name);
    
    // then determine which tags to remove
    const tagsToRemove = currentTags.filter(tag => !tags.includes(tag.name));
    const tagsToAdd = tagInstances.filter(tagInstance => !currentTagNames.includes(tagInstance.name));

    // remove the old tags
    if (tagsToRemove.length > 0) {
      await item.removeAssociatedTags(tagsToRemove);
    }

    // add new tags
    if (tagsToAdd.length > 0) {
      await item.addAssociatedTags(tagsToAdd);
    }

    // Get updated tags to confirm
    const updatedTags = await item.getAssociatedTags();
    console.log('Updated Associated Tags:', updatedTags); // Debugging

    res.status(200).json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Internal Server Error');
  }
};


const getRecentItems = async (req, res) => {
  try {
  
    const limitParam = req.query.limit;
    const limit = parseInt(limitParam, 10);

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Invalid limit parameter. Must be a positive integer.' });
    }
    const recentItems = await Item.findAll({
      attributes: ['name', 'collectionId', 'createdAt'],
      include: [
        {
          model: Collection,
          as: 'Collection',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['userName'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']], 
      limit: limit, 
    });

    
    res.json(recentItems);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


// Delete an item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).send('Item not found');

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const itemsForFeed = async (req, res) => {
  try {
    const items = await Item.findAll({
      attributes: ['id', 'name', 'createdAt', 'updatedAt', 'likesCount'],
      include: [
        {
          model: Collection,
          as: 'Collection', // Ensure this matches the alias used in your model association
          attributes: ['name', 'imageUrl'],
          include: [
            {
              model: User,
              as: 'User', // Ensure this matches the alias used in your model association
              attributes: ['userName'] // Corrected to be a string
            }
          ]
        },
        {
          model: Tag,
          as: 'associatedTags', // Ensure this matches the alias used in your model association
          attributes: ['name']
        }
      ]
    });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'Items Not Found' });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem, getRecentItems, itemsForFeed};