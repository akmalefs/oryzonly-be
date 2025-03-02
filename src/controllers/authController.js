import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerAction = async (req, res) => {
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

export const loginAction = async (req, res) => {
  try {
    const value = req.body;

    // cek email terdaftar di database atau tidak
    const existingUser = await userModel
      .findOne()
      .where("email")
      .equals(value.email);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // cek password
    const isPasswordMatch = bycrypt.compareSync(
      value.password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        data: {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
        },
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login success",
      data: {
        name: existingUser.name,
        email: existingUser.email,
        token,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
