// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";

// import connectDB from "./config/db.js";

dotenv.config(); //Configuring dotenv

connectDB(); //connecting to database

const app = express(); //initializing application

// //middleware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true })); //using body parser

app.use("/api/v1/auth", authRoutes); //Route for authentication
// app.use("/api/v1/category", categoryRoutes); //Route for Category

// app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the homepage</h1>"); //Sending data to homepage
});

app.post("/test", (req, res) => {
  console.log("Test");
  res.status(201).send({ message: "message from server" });
});
app.listen(8800, () => {
  console.log("server is running on port 8800");
});
