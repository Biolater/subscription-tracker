import aj from "../config/arcjet.js"; // Import the Arcjet library

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Request denied: Bot detected",
        });
      } else if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Request denied: Rate limit exceeded",
        });
      }
    }
    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next(error);
  }
};

export default arcjetMiddleware;
// This middleware uses the Arcjet library to protect routes by checking if the request is coming from a bot or if it is rate limited. If the request is denied, it sends an appropriate response based on the reason for denial. If the request is allowed, it calls the next middleware or route handler.
// The middleware also handles any errors that occur during the protection check and logs them to the console.
// This is useful for protecting your API from abuse and ensuring that only legitimate requests are processed.
