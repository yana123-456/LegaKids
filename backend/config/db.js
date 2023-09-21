import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URL}`);

    console.log("connected to mongodb");
  } catch (error) {
    console.log("Error in connecting to database:");
    console.log(error);
  }
};

export default connectDB;
