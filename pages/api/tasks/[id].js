import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { Task } from "@/models/Task";
import { checkAuth, connectDB } from "@/utils/features";

const handler = asyncErrorHandler(async (req, res) => {
  const user = await checkAuth(req, res);

  await connectDB();

  const task = await Task.findById(req.query.id);

  if (!task) return errorHandler(res, 404, "Task Not Found");

  if (user._id.toString() === task.user.toString()) {
    if (req.method === "PUT") {
      task.isCompleted = !task.isCompleted;

      await task.save();

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
      });
    } else if (req.method === "DELETE") {
      await task.deleteOne();
      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } else {
      return errorHandler(
        res,
        400,
        `${req.method} method is not available for this route`
      );
    }
  } else {
    res.status(401).json({
      success: false,
      error: "This task doesn't belong to logged user",
    });
  }
});

export default handler;
