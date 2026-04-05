import express from 'express';
import passport from '../auth.js';
import venomController from '../controllers/venomDriveController.js';
import ensureAuth from '../middleware/auth.js';

const router = express.Router();

router.get("/", venomController.entryPoint);
router.get("/login", venomController.getMemberAuth);
router.get("/home", ensureAuth, venomController.getHome);

router.post("/register", venomController.registerUser)

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}))

router.post("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/login");
    });
})


export default router;