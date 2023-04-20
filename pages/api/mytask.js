import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { Task } from "@/models/Task";
import { checkAuth, connectDB } from "@/utils/features";

const handler = asyncErrorHandler(async (req, res) => {
  if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET request is allowed");

  const user = await checkAuth(req, res);

  await connectDB();

  const tasks = await Task.find({ user: user._id });
  res.status(200).json({
    success: true,
    tasks,
  });
});

export default handler;
