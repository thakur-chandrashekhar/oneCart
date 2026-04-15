import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";

// 🔥 COMMON COOKIE FUNCTION
const sendToken = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ================= REGISTER =================
export const registration = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase();

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid Email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Enter Strong Password" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashPassword });

    const token = await genToken(user._id);
    sendToken(res, token);

    user.password = undefined;
    return res.status(201).json(user);

  } catch (error) {
    console.log("registration error", error);
    return res.status(500).json({ message: "registration error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);
    sendToken(res, token);

    user.password = undefined;
    return res.status(200).json(user);

  } catch (error) {
    console.log("login error", error);
    return res.status(500).json({ message: "Login error" });
  }
};

// ================= LOGOUT =================
export const logOut = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.log("logout error", error);
    return res.status(500).json({ message: "Logout error" });
  }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res) => {
  try {
    let { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    email = email.toLowerCase();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email });
    }

    const token = await genToken(user._id);
    sendToken(res, token);

    user.password = undefined;
    return res.status(200).json(user);

  } catch (error) {
    console.log("googleLogin error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};

// ================= ADMIN LOGIN =================
export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = await genToken1(email);
      sendToken(res, token);

      return res.status(200).json(token);
    }

    return res.status(400).json({ message: "Invalid credentials" });

  } catch (error) {
    console.log("AdminLogin error", error);
    return res.status(500).json({ message: "Admin login error" });
  }
};
