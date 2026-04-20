import express from 'express';
import passport from '../auth.js';
import venomController from '../controllers/venomDriveController.js';
import ensureAuth from '../middleware/auth.js';
import {upload} from '../middleware/upload.js';
import prisma from '../prisma.js';

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
    // console.log("ERR:", err);
    // console.log("USER:", user);
    // console.log("INFO:", info);

    if (err) {
      return next(err);
    }

    if (!user) {
      // console.log("Login failed:", info);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        // console.log("Login session error:", err);
        return next(err);
      }

      // console.log("Login success:", user);
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
  "/upload",
  ensureAuth,
  upload.single("file"),
  venomController.uploadFile
);

router.post("/create-folder", ensureAuth, venomController.createFolder);
router.get("/read-folder/:folderId", ensureAuth, venomController.readFolder);
router.get("/update-folder/:folderId", ensureAuth, venomController.updateFolder);
router.post("/edit-folder", ensureAuth, venomController.postFolderEdit);
router.post("/delete-folder/:folderId", ensureAuth, venomController.deleteFolder);
router.post("/upload-file", ensureAuth, venomController.uploadFile);
router.post("/move-file", ensureAuth, venomController.moveFile);
router.get("/view/:id", ensureAuth, venomController.viewFile);
router.get("/uploads/:id", ensureAuth, venomController.downloadFile);
router.post("/delete-file/:id", ensureAuth, venomController.deleteFile)
router.post("/create-share-link/:fileId", ensureAuth, venomController.createShareLink)
router.get("/share/:token", venomController.viewSharedFolder)

export default router;