import Cors from "micro-cors";
import model from "./model";
const cors = new Cors();

const updateapi = async (req, res) => {
  try {
    const user = await model();
    await user.update(
      {
        name: req.body.values.fname,
        sname: req.body.values.lname,
      },
      {
        where: {
          idx: req.body.values.idx,
        },
      }
    );
    res.send({ data: "success" });
  } catch (err) {
    res.send({ data: "error" });
  }
};
export default cors(updateapi);
