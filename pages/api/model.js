import { DataTypes } from "sequelize";
import dbconnection from "./dbconnection";

const model = async () => {
  const connection = await dbconnection();
  const User = connection.define(
    "sample",
    {
      idx: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      sname: {
        type: DataTypes.STRING(100),
      },
    },
    {
      tableName: "sample",
      timestamps: false,
    }
  );
  return User;
};
export default model;
