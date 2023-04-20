import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { Task } from "@/models/Task";
import { User } from "@/models/User";
import { checkAuth, connectDB } from "@/utils/features";

const handler = asyncErrorHandler(async (req, res) => {
  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST request is allowed");

  const { title, description } = req.body;

  if (!title || !description)
    return errorHandler(res, 400, "All fields are required");

  const user = await checkAuth(req, res);

  await connectDB();

  const task = await Task.create({
    title,
    description,
    user: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
  });
});

export default handler;
