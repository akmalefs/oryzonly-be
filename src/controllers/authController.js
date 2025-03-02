import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import crypto from "crypto";

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

export const loginWithGoogleAction = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
    });

    return res.redirect(url);
  } catch (error) {
    console.log(error);
  }
};

export const loginWithGoogleCallbackAction = async (req, res) => {
  try {
    const { code } = req.query;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name) {
      return res.json({
        data: data,
      });
    }

    let user = await userModel.findOne({ email: data.email }).lean();

    if (!user) {
      try {
        user = await userModel.create({
          name: data.name,
          email: data.email,
          password: crypto.randomBytes(16).toString("hex"),
        });
      } catch (error) {
        if (error.code === 11000) {
          user = await userModel.findOne({ email: data.email }).lean(); // Ambil ulang user
        } else {
          throw error;
        }
      }
    }

    const token = jwt.sign(
      {
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login success",
      data: {
        name: user.name,
        email: user.email,
        token,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
