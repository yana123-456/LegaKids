import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // console.log(req.body);
    // console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access

export const isAdmin = async (req, res, next) => {
  try {
    // console.log("ISADMIN BEGINS");
    // console.log(req.body);
    // const { _id } = req.body;
    // console.log(_id);
    const user = await userModel.findById(req.user._id);
    // console.log(user);

    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      // res.status(200).send({
      //   success: true,
      //   message: "access granted",
      // });
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "error in admin middleware",
      error,
    });
  }
};
