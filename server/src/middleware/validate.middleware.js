export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body data.',
        details: error.errors?.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        })) || []
      }
    });
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request URL parameters.',
        details: error.errors?.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        })) || []
      }
    });
  }
};
