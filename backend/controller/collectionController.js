const db = require('..');
const { Sequelize } = require('sequelize');
const {Collection, User, Item} = db;


//create new collection

const createCollection = async (req, res) => {
  try {
    const { name, description, imageUrl, userId, categoryId, ...customFields } = req.body;
    
    // Log the custom fields separately
    console.log('Raw Custom Fields:', customFields);

    // Transform custom fields
    let customFieldsTransformed = {};
    Object.keys(customFields).forEach(key => {
      if (key.startsWith('custom_')) {
        const [type, index, field] = key.split('_');
        if (field === 'state') {
          customFieldsTransformed[`${type}_${index}_state`] = customFields[key];
        } else if (field === 'name') {
          customFieldsTransformed[`${type}_${index}_name`] = customFields[key];
        }
      }
    });

    console.log('Transformed Custom Fields:', customFieldsTransformed);

    // Construct final payload
    const payload = {
      name,
      description,
      imageUrl,
      userId,
      categoryId,
      ...customFieldsTransformed,
    };

    console.log('Final Payload:', payload);

    // Create collection in database
    const newCollection = await Collection.create(payload);
    console.log('New Collection Saved:', newCollection);

    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};


//-----------------------------------------------------------------------------------------
//Get all collections with specific attributes

const getCollections = async (req, res) => {
  try{
    const collections = await Collection.findAll({
      attributes:['id','name','description', 'imageUrl', 'categoryId'],
      include: [
        {
          model: User,
          attributes: ['userName'],
          as: 'User'
        },
      ],
    });

    if(!collections) return res.status(404).send('Collection Not Found');

    const response = collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      imageUrl: collection.imageUrl,
      categoryId: collection.categoryId,
      userName: collection.User ? collection.User.userName : null, // Safely handle the User relation
    }));

    res.status(200).json(response);
  } catch(error){
    console.error('Error fetching collections:', error);
    res.status(500).send('Internal Server Error');
  }
};

//-------------------------------------------------------------------------------------



//Get one collection

const getCollectionById = async(req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id, {
      attributes: [
        'id', 'name', 'description', 'imageUrl', 'categoryId',
        'custom_int1_state', 'custom_int1_name',
        'custom_int2_state', 'custom_int2_name',
        'custom_int3_state', 'custom_int3_name',
        'custom_string1_state', 'custom_string1_name',
        'custom_string2_state', 'custom_string2_name',
        'custom_string3_state', 'custom_string3_name',
        'custom_text1_state', 'custom_text1_name',
        'custom_text2_state', 'custom_text2_name',
        'custom_text3_state', 'custom_text3_name',
        'custom_bool1_state', 'custom_bool1_name',
        'custom_bool2_state', 'custom_bool2_name',
        'custom_bool3_state', 'custom_bool3_name',
        'custom_date1_state', 'custom_date1_name',
        'custom_date2_state', 'custom_date2_name',
        'custom_date3_state', 'custom_date3_name',
      ],
      include: [
        {
          model: User,
          attributes: ['userName'],
          as: 'User'
        },
      ],
    });

    if(!collection) {
      console.error('Collection not found for ID:', req.params.id);
      return res.status(404).send('Collection Not Found');
    }

    const customFields = [
      { type: 'int', state: collection.custom_int1_state, name: collection.custom_int1_name },
      { type: 'int', state: collection.custom_int2_state, name: collection.custom_int2_name },
      { type: 'int', state: collection.custom_int3_state, name: collection.custom_int3_name },
      { type: 'string', state: collection.custom_string1_state, name: collection.custom_string1_name },
      { type: 'string', state: collection.custom_string2_state, name: collection.custom_string2_name },
      { type: 'string', state: collection.custom_string3_state, name: collection.custom_string3_name },
      { type: 'text', state: collection.custom_text1_state, name: collection.custom_text1_name },
      { type: 'text', state: collection.custom_text2_state, name: collection.custom_text2_name },
      { type: 'text', state: collection.custom_text3_state, name: collection.custom_text3_name },
      { type: 'date', state: collection.custom_date1_state, name: collection.custom_date1_name },
      { type: 'date', state: collection.custom_date2_state, name: collection.custom_date2_name },
      { type: 'date', state: collection.custom_date3_state, name: collection.custom_date3_name },
      { type: 'bool', state: collection.custom_bool1_state, name: collection.custom_bool1_name },
      { type: 'bool', state: collection.custom_bool2_state, name: collection.custom_bool2_name },
      { type: 'bool', state: collection.custom_bool3_state, name: collection.custom_bool3_name }
  
    ].filter(field => field.state || field.name); // Filter out fields that are not present;

    const response = {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      imageUrl: collection.imageUrl,
      categoryId: collection.categoryId,
      userName: collection.User ? collection.User.userName : null,
      customFields,
     
    };

    console.log('Collection data to send:', response);  // Debug log
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching collection by ID:', error);
    res.status(500).send('Internal Server Error');
  }
};


//view  collections by id including items 
const viewCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Item,
          as: 'Items',
          attributes: [
            'id', 
            'name', 
            'custom_int1_value', 'custom_int2_value', 'custom_int3_value',
            'custom_string1_value', 'custom_string2_value', 'custom_string3_value',
            'custom_text1_value', 'custom_text2_value', 'custom_text3_value',
            'custom_bool1_value', 'custom_bool2_value', 'custom_bool3_value',
            'custom_date1_value', 'custom_date2_value', 'custom_date3_value'
          ],
        },
        {
          model: User,
          attributes: ['userName'],
          as: 'User'
        },
      ],
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Update a collection
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, imageUrl, ...transformedCustomFields } = req.body;

    console.log("Incoming request data:", { name, description, categoryId, imageUrl, ...transformedCustomFields });

    const collection = await Collection.findByPk(id);
    if (!collection) return res.status(404).send('Collection not found');

    // Update non-custom fields
    collection.name = name;
    collection.description = description;
    collection.categoryId = categoryId;
    collection.imageUrl = imageUrl;

    // Update custom fields
    Object.keys(transformedCustomFields).forEach(key => {
      collection[key] = transformedCustomFields[key];
    });

    await collection.save();

    console.log("Updated collection data:", collection);

    res.status(200).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};



//get the largest collection

const getLargestCollection = async (req, res) => {
  try {
   
    const collections = await Collection.findAll({
      attributes: [
        'id', 
        'name',
        'createdAt', 
        'imageUrl',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "items" AS "Items"
          WHERE "Items"."collectionId" = "collections"."id"
        )`), 'itemCount'],
      ],
      order: [[Sequelize.literal('"itemCount"'), 'DESC']],
      limit: 5,
      include: [
        {
          model: User,
          as: "User",
          attributes: ['userName'], 
        }
      ]
    });
    const result = collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      author: collection.User.userName,
      image: collection.imageUrl,
      created: (collection.createdAt).toLocaleString()
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top collections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a collection
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByPk(id);
    if (!collection) return res.status(404).send('Collection not found');

    await collection.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { createCollection, getCollections, getCollectionById, viewCollection, updateCollection, getLargestCollection, deleteCollection };

