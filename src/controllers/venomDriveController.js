async function getMemberAuth(req, res) {
    res.render("auth.ejs")
}

async function entryPoint(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/home");
    } else {
        res.redirect("/login");
    }
}

async function getHome(req, res) {
    if (req.isAuthenticated()) {
        res.render("home.ejs");
    } else {
        res.redirect("/login");
    }
}


export default {
    getMemberAuth,
    entryPoint,
    getHome
}   