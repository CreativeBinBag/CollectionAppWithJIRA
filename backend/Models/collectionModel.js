module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define("collections", {
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
    description: {
      type: DataTypes.TEXT, // Changed from STRING to TEXT to support markdown
      allowNull: true,
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Changed to true as it’s optional
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    
    },

    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

     // Custom Integer Fields
     custom_int1_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_int1_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_int2_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_int2_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_int3_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_int3_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Custom String Fields
    custom_string1_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_string1_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_string2_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_string2_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_string3_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_string3_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Custom Multiline Text Fields
    custom_text1_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_text1_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_text2_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_text2_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_text3_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_text3_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Custom Boolean Fields
    custom_bool1_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_bool1_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_bool2_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_bool2_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_bool3_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_bool3_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Custom Date Fields
    custom_date1_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_date1_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_date2_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_date2_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_date3_state: {
      type: DataTypes.ENUM("NOT_PRESENT", "PRESENT_OPTIONAL", "PRESENT_REQUIRED"),
      allowNull: true,
    },
    custom_date3_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    
  }, {
    timestamps: true,
    tableName: "collections",
  });

  Collection.associate = (Models) => {
    // One-to-Many Relationships
    Collection.hasMany(Models.Item, {
      foreignKey: "collectionId",
      as: 'Items',
      onDelete: 'CASCADE',
    });

  
    // Many-to-One Relationship
    Collection.belongsTo(Models.User, {
      foreignKey: 'userId',
       as: 'User'
    });
  };


  return Collection;
};
