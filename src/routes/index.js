import express from 'express';
import passport from '../auth.js';
import venomController from '../controllers/venomDriveController.js';
import ensureAuth from '../middleware/auth.js';
import {upload} from '../middleware/upload.js';

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

router.post(
  '/upload',
  (req, res, next) => {
    if(!req.isAuthenticated()){
      return res.status(401).send("Unauthorized upload");
    }
    next()
  },
  upload.single('file'),
  async (req, res) => {

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    try {
      await prisma.file.create({
        data: {
          filename: req.file.originalname,
          path: req.file.path,
          userId: req.user.id        
        }
      })
      res.status(200).send("File uploaded successfully");
      res.redirect("/home");
    } catch(err){
      console.error("Error saving file to database:", err);
      res.status(500).send("Server error while saving file");
      res.redirect("/home");
    }

  }
)

export default router;