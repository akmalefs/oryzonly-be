import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";

export const signUpAction = async (req, res) => {
  try {
    const value = req.body;

    // hashing password
    const passwordHash = bycrypt.hashSync(value.password, 12);

    const user = new userModel({
      name: value.name,
      email: value.email,
      password: passwordHash,
    });

    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
