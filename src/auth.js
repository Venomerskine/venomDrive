import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "./prisma.js";
import bcrypt from "bcrypt";
import { ca } from "zod/locales";

passport.use(
  new LocalStrategy(
    async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email: username } });

      if (!user) {
        return done(null, false, { message: "Incorrect email." }); // Risky for security, but for demonstration purposes only. In production, consider a more generic message.  
      };


      const isMatch = await bcrypt.compare(password, user.password);


      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." }); // also risky
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
