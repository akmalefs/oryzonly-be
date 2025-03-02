import { ZodError } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => err.message);

      return res.status(500).json({
        message: "Validation Error",
        detail: errors,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
