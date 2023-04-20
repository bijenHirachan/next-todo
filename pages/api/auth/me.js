import { asyncErrorHandler, errorHandler } from "@/middlewares/error";
import { checkAuth } from "@/utils/features";

const handler = asyncErrorHandler(async (req, res) => {
  if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET method is allowed");

  const user = await checkAuth(req, res);

  return res.status(200).json({
    success: true,
    user,
  });
});

export default handler;
