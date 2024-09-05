const db = require('..');
const { Item, Tag, Collection, User } = db;

// Example using Sequelize
const getItemsByTag = async (req, res) => {
  const { tagId } = req.params;

  try {
    const items = await Item.findAll({
      include: [
        {
          model: Collection,
          as: 'Collection',
          attributes: [
            'custom_int1_name', 'custom_int2_name', 'custom_int3_name',
            'custom_string1_name', 'custom_string2_name', 'custom_string3_name',
            'custom_text1_name', 'custom_text2_name', 'custom_text3_name',
            'custom_bool1_name', 'custom_bool2_name', 'custom_bool3_name',
            'custom_date1_name', 'custom_date2_name', 'custom_date3_name',
            'custom_int1_state', 'custom_int2_state', 'custom_int3_state',
            'custom_string1_state', 'custom_string2_state', 'custom_string3_state',
            'custom_text1_state', 'custom_text2_state', 'custom_text3_state',
            'custom_bool1_state', 'custom_bool2_state', 'custom_bool3_state',
            'custom_date1_state', 'custom_date2_state', 'custom_date3_state'
          ],
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['userName'],
            },
          ],
        },
        {
          model: Tag,
          as: 'associatedTags',
          where: { id: tagId }
        }
      ]
    });

    // Extract the custom field names from the collection
    const collectionCustomFields = items.reduce((acc, item) => {
      const collection = item.Collection;
      if (collection) {
        for (const key in collection.dataValues) {
          if (key.endsWith('_name') && collection.dataValues[key]) {
            acc[key] = collection.dataValues[key];
          }
        }
      }
      return acc;
    }, {});

    res.json({ items, collectionCustomFields });
  } catch (error) {
    console.error('Error fetching items by tag:', error);
    res.status(500).send('Internal server error');
  }
};


module.exports = { getItemsByTag};
