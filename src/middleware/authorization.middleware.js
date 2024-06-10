export const authorization = (...roles) => {
    return async (req, res, next) => {
        if (roles.includes('public')) return next();
        if (!req.user) return res.status(401).json({ status: 'error', error: 'Unauthorized' });
        if (!roles.includes(req.user.role)) return res.status(403).json({ status: 'error', error: 'Not permissions' });
        next();
    };
};
