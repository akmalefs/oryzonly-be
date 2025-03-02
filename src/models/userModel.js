import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar_file_name: {
      type: String,
    },
    occopation: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    nationality: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userModel);
