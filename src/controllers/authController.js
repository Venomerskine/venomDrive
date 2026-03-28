import express from 'express';
import passport from 'passport';
 
const router = express.Router();

// Login route
router.post('/login', 
    passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in ', user: req.user });
});

router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json({ message: 'Logged out' });
    });
});

export default router;