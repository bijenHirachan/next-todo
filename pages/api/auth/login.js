import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { User } from "@/models/User";
import { connectDB, cookieSetter, generateToken } from "@/utils/features";
import bcrypt from "bcrypt";

const handler = asyncErrorHandler(async (req, res) => {
  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST method is allowed");

  const { email, password } = req.body;

  if (!email || !password)
    return errorHandler(res, 400, "All fields are required");

  await connectDB();

  const user = await User.findOne({ email }).select("+password");

  if (!user) return errorHandler(res, 400, "Invalid Credentials");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return errorHandler(res, 400, "Invalid Credentials");

  const token = generateToken(user._id);

  cookieSetter(res, token, true);

  return res.status(201).json({
    success: true,
    message: `Welcome back, ${user.name}`,
    user,
  });
});

export default handler;
