module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("likes", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    tableName: "likes",
  });


  Like.associate = (Models) => {
    // Many-to-One Relationships
    Like.belongsTo(Models.User, {
      foreignKey: "userId",
      onDelete: 'CASCADE',
    });

    Like.belongsTo(Models.Item, {
      foreignKey: "itemId",
      onDelete: 'CASCADE',

    });
  };


  return Like;
};
