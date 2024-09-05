const { index } = require('../config/algoliaClient');

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("items", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings to store tags
      allowNull: true,
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Custom Integer Fields
    custom_int1_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    custom_int2_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    custom_int3_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Custom String Fields
    custom_string1_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_string2_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_string3_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Custom Multiline Text Fields
    custom_text1_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    custom_text2_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    custom_text3_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Custom Boolean Fields
    custom_bool1_value: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    custom_bool2_value: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    custom_bool3_value: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    // Custom Date Fields
    custom_date1_value: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    custom_date2_value: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    custom_date3_value: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "items",
  });

  //hooks for indexing
  Item.afterCreate(async (item, options) => {
  try{
    await index.saveObject({
      objectID: item.id,
      name: item.name,
      collectionId: item.collectionId,
      custom_int1_value: item.custom_int1_value ?? 0,
      custom_int2_value: item.custom_int2_value ?? 0,
      custom_int3_value: item.custom_int3_value ?? 0,
      custom_string1_value: item.custom_string1_value || '',
      custom_string2_value: item.custom_string2_value || '',
      custom_string3_value: item.custom_string3_value || '',
      custom_text1_value: item.custom_text1_value || '',
      custom_text2_value: item.custom_text2_value || '',
      custom_text3_value: item.custom_text3_value || '',
      custom_bool1_value: item.custom_bool1_value ?? false,
      custom_bool2_value: item.custom_bool2_value ?? false,
      custom_bool3_value: item.custom_bool3_value ?? false,
      custom_date1_value: item.custom_date1_value ? item.custom_date1_value.toISOString() : null,
      custom_date2_value: item.custom_date2_value ? item.custom_date2_value.toISOString() : null,
      custom_date3_value: item.custom_date3_value ? item.custom_date3_value.toISOString() : null,
    })
  } catch(error) {
    console.error('Error syncing with Algolia', error);
  }
  });

  Item.afterUpdate(async (item, options) => {
    try{
      await index.saveObject({
        objectID: item.id,
        name: item.name,
        collectionId: item.collectionId,
        custom_int1_value: item.custom_int1_value ?? 0,
        custom_int2_value: item.custom_int2_value ?? 0,
        custom_int3_value: item.custom_int3_value ?? 0,
        custom_string1_value: item.custom_string1_value || '',
        custom_string2_value: item.custom_string2_value || '',
        custom_string3_value: item.custom_string3_value || '',
        custom_text1_value: item.custom_text1_value || '',
        custom_text2_value: item.custom_text2_value || '',
        custom_text3_value: item.custom_text3_value || '',
        custom_bool1_value: item.custom_bool1_value ?? false,
        custom_bool2_value: item.custom_bool2_value ?? false,
        custom_bool3_value: item.custom_bool3_value ?? false,
        custom_date1_value: item.custom_date1_value ? item.custom_date1_value.toISOString() : null,
        custom_date2_value: item.custom_date2_value ? item.custom_date2_value.toISOString() : null,
        custom_date3_value: item.custom_date3_value ? item.custom_date3_value.toISOString() : null,
      })
    } catch(error) {
      console.error('Error syncing with Algolia', error);
    }
    });

    Item.afterDestroy(async (item, options) => {
      try{
        await index.deleteObject(item.id)
      } catch(error) {
        console.error('Error syncing with Algolia', error);
      }
      });



  Item.associate = (Models) => {
    // One-to-Many Relationships
    Item.hasMany(Models.Comment, {
      foreignKey: "itemId",
      onDelete: 'CASCADE',
    });

    Item.hasMany(Models.Like, {
      foreignKey: "itemId",
      onDelete: 'CASCADE',
    });

    // Many-to-One Relationship
    Item.belongsTo(Models.Collection, {
      foreignKey: "collectionId",
      as: "Collection"
    });

    // Many-to-Many Relationship through Likes
    Item.belongsToMany(Models.User, {
      through: "Likes",
      foreignKey: "itemId",
    });

    Item.belongsToMany(Models.Tag, {
      through: "ItemTags",
      foreignKey: "itemId",
      as: "associatedTags", // Specify an alias to avoid collision

    });
  };

  return Item;
};
