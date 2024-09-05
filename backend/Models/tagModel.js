module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("tags", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    timestamps: true,
    tableName: "tags",
  });

  Tag.associate = (Models) => {
    // Many-to-Many with Items
    Tag.belongsToMany(Models.Item, {
      through: "ItemTags",
      foreignKey: "tagId",
      as: "associatedItems", // Specify an alias to avoid collision

    });
  };

  return Tag;
};
