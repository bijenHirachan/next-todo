import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { User } from "@/models/User";
import { connectDB, cookieSetter, generateToken } from "@/utils/features";
import bcrypt from "bcrypt";

const handler = asyncErrorHandler(async (req, res) => {
  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST method is allowed");

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return errorHandler(res, 400, "All fields are required");

  await connectDB();

  const userExist = await User.findOne({ email });

  if (userExist) return errorHandler(res, 400, "User already exist");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(user._id);

  cookieSetter(res, token, true);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

export default handler;
