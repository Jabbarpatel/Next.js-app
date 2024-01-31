import { Sequelize } from "sequelize";

const dbconnection = async () => {
  const connection = new Sequelize("mysql://root:admin@localhost/user");
  return connection;
};
export default dbconnection;
