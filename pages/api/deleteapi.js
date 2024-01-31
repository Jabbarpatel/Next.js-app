import model from "./model";
import Cors from "micro-cors";
const cors = new Cors();

const deleteapi = async (req, res) => {
  try {
    const user = await model();
    await user.destroy({
      where: {
        idx: req.query.idx,
      },
    });
    res.send({ data: "success" });
  } catch (err) {
    res.send({ data: "error" });
    console.log(err);
  }
};
export default cors(deleteapi);
