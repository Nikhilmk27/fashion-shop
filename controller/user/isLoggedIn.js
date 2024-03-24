// loggedInMiddleware.js

// Middleware function to check if user is logged in
const loggedInMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        // User is logged in, proceed to the next middleware or route handler
        next();
    } else {
        // User is not logged in, redirect to login page or send unauthorized response
        res.status(401).send('Unauthorized. Please log in.');
    }
};

module.exports = loggedInMiddleware;
