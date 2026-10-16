import rateLimit from 'express-rate-limit';

export const productSearchRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 240,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});
