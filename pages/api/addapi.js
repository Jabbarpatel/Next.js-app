import Cors from "micro-cors";
import model from "./model";
const cors = new Cors();

const addapi = async (req, res) => {
  try {
    const user = await model();
    const result = await user.findAll({ attributes: ["idx"] });
    const idx = result.map((item) => item.dataValues.idx);
    const availableidx = [];
    for (let i = 1; i < idx[idx.length - 1]; i++) {
      if (!idx.includes(i)) {
        availableidx.push(i);
      }
    }
    await user.create({
      idx: availableidx.length > 0 ? availableidx[0] : idx[idx.length - 1] + 1,
      name: req.body.values.fname,
      sname: req.body.values.lname,
    });
    res.send({ data: "success" });
  } catch (err) {
    res.send({ data: "error" });
  }
};
export default cors(addapi);
