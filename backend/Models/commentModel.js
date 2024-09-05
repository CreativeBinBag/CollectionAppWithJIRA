module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comments", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "comments",
  });

  Comment.associate = (Models) => {
    // Many-to-One Relationships
    Comment.belongsTo(Models.User, {
      foreignKey: "userId",
      onDelete: 'CASCADE',
      as: 'User'
    });

    Comment.belongsTo(Models.Item, {
      foreignKey: "itemId",
      onDelete: 'CASCADE',
    });
  };

  return Comment;
};
