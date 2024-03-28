
const adminAuth = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.status(401).render('../views/admin/adminSignin')
    }
};

module.exports = adminAuth;
