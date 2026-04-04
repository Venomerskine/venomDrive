const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(402).send("Unauthorized");
    res.redirect("/login");
}

export default ensureAuth;