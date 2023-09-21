import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import bodyParser from "body-parser";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  //This function will register the users

  try {
    //destructuring body
    const { name, email, password, phone, address, answer } = await req.body;

    //code for form validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }

    //Checking if user already exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(200).send({
        success: false,
        message: "User Already exists, please log in",
      });
    }

    //hashing password
    const hashedPassword = await hashPassword(password);

    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save(); // New user saved in the database, registration complete

    res.status(201).send({
      success: true,
      message: "user registered",
      user,
    });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in registration", error: error });

    console.log(error);
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    //destructuring the data
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //checking if user exists
    const user = await userModel.findOne({ email });

    // If user doesn't exist, we return
    if (!user) {
      console.log("user doesnt exist");
      return res.status(200).send({
        success: false,
        message: "User not registered",
      });
    }

    //comparing the password sent by the user to the hashed password in the user object (user.password)
    //We have created the method comparePassword for this purpose
    const match = await comparePassword(password, user.password);

    //If compare password returns false aka the passwords do not match, we return false.
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "password invalid",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in logging in",
      error,
    });
  }
};

//FORGOT PASSWORD CONTROLLER

export const forgotPasswordController = async (req, res) => {
  try {
    //destructuring
    const { email, answer, newPassword } = req.body;

    //form validation
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    //finding user with a particular email and answer

    const user = await userModel.findOne({ email, answer });

    //validation

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller

export const testController = (req, res) => {
  console.log("protected route");
  res.send("Protected route");
};
