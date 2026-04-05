import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import  prisma  from './prisma.js';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { email:username } });
            console.log("User in passport:", user)

            if (!user){ 
                return done(null, false, { message: "User not found" });}

            const match = await bcrypt.compare(password, user.password);

            if (!match) return done(null, false, {message: "Username password mismatch"});

            return done(null, user);
        } catch (err){
            return done(err);
        }
    }
))

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