const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Items = sequelize.define("items", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   name: {
      type: DataTypes.STRING(30),
   },
   price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
   },
   image_path: {
      type: DataTypes.STRING(50),
   },
   section: {
      type: DataTypes.ENUM("men", "women", "kids"),
      allowNull: false,
   },
   type: {
      type: DataTypes.ENUM("jeans", "shirts", "coats", "dresses", "skirts"),
      allowNull: false,
   },
   available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
   } 
}, {
   tableName: "items",
});

module.exports = Items;