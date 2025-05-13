module.exports = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error('Authorize middleware: No user found in request');
            return res.status(403).json({ error: 'Không có thông tin người dùng' });
        }

        if (!req.user.role) {
            console.error(`Authorize middleware: User ${req.user.id} has no role defined`);
            return res.status(403).json({ error: 'Vai trò người dùng không được xác định' });
        }

        // if (!roles.includes(req.user.role)) {
        //     console.log(roles);
        //     console.error(`Authorize middleware: User ${req.user.id} with role ${req.user.role} not authorized for roles ${roles.join(', ')}`);
        //     return res.status(403).json({ error: 'Không có quyền truy cập 24' });
        // }

        console.log(`Authorize middleware: User ${req.user.id} with role ${req.user.role} authorized`);
        next();
    };
};