import mongoose from "mongoose";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import { errorHandler } from "@/middlewares/error";

export const connectDB = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI, {
    dbName: "NextTodo",
  });
  console.log(`Database connected on host: ${connection.host}`);
};

export const cookieSetter = (res, token, set) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", set ? token : "", {
      path: "/",
      httpOnly: true,
      maxAge: set ? 15 * 24 * 60 * 60 * 1000 : 0,
    })
  );
};

export const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const checkAuth = async (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) return errorHandler(res, 401, "Login First");

  const token = cookie.split("=")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return await User.findById(decoded._id);
};
