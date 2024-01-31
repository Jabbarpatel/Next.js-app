import Cors from "micro-cors";
import model from "./model";
import { Op } from "sequelize";
const cors = new Cors();

const getapi = async (req, res) => {
  try {
    const usertable = await model();
    const pagination = req.query.page.split(",");
    if (req.query.filter) {
      const result = await usertable.findAll({
        where: {
          name: {
            [Op.like]: `%${req.query.filter}%`,
          },
        },
      });
      res.send({ data: result });
    } else {
      const result = await usertable.findAll({
        limit: parseInt(pagination[1]),
        offset: (parseInt(pagination[0]) - 1) * parseInt(pagination[1]),
      });
      const count = await usertable.count();
      let totalPage = count / parseInt(pagination[1]);
      if (totalPage % 2 !== 0) {
        totalPage += 1;
      }
      res.send({ data: result, pagesize: parseInt(totalPage) });
    }
  } catch (err) {
    res.send({ data: "error" });
  }
};

export default cors(getapi);
