import express from 'express';
import passport from '../auth.js';
import venomController from '../controllers/venomDriveController.js';
import ensureAuth from '../middleware/auth.js';

const router = express.Router();

router.get("/", venomController.entryPoint);
router.get("/login", venomController.getMemberAuth);
router.get("/home", ensureAuth, venomController.getHome);

router.post("/register", venomController.registerUser)

// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/home",
//     failureRedirect: "/login"
// }))

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("ERR:", err);
    console.log("USER:", user);
    console.log("INFO:", info);

    if (err) {
      return next(err);
    }

    if (!user) {
      console.log("Login failed:", info);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log("Login session error:", err);
        return next(err);
      }

      console.log("Login success:", user);
      return res.redirect("/home");
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/login");
    });

})


export default router;