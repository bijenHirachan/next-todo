import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { cookieSetter } from "@/utils/features";

const handler = asyncErrorHandler(async (req, res) => {
  if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET method is allowed");

  cookieSetter(res, null, false);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default handler;
