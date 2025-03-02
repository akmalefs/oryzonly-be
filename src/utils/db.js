import mongoose from "mongoose";

export default function connetDB() {
  try {
    mongoose.connect(process.env.MONGODB_DATABASE);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  mongoose.connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });

  mongoose.connection.on("error", (error) => {
    console.log("MongoDB connection error: ", error);
  });
}
