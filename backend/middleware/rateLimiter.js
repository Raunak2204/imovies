import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter - generous limit to prevent blocking users, assets, and health checks
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // 2000 requests per 15 mins
  message: {
    success: false,
    error: 'Too many requests, please try again after a few minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.path === '/' ||
    req.path === '/health' ||
    req.path === '/api/v1/health',
});

/**
 * Auth routes rate limiter - allows reasonable login/register testing without premature lockouts
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 attempts per 15 mins
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again after a few minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
