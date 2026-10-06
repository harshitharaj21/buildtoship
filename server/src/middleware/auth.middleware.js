import { supabaseAdmin } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Missing or malformed Bearer token.'
        }
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token using Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired authentication token.'
        }
      });
    }

    // Attach verified user to request object
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_VERIFICATION_ERROR',
        message: 'Internal server error during authentication verification.'
      }
    });
  }
};
