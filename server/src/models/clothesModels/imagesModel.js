const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const Items = require("./itemsModel");

const ItemsImages = sequelize.define("itemsImages", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   path: {
      type: DataTypes.STRING(50),
      allowNull: false,
   },
}, {
   tableName: "itemsImages",
});

ItemsImages.belongsTo(Items, {
   foreignKey: {
      name: "item_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   }
});

module.exports = ItemsImages;