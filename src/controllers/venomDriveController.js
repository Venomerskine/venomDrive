import bcypt from 'bcrypt';
import prisma from '../prisma.js'

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

async function registerUser(req, res) {
    try{
        const { email, password} = req.body;
        
        // Dunda wire testing
        console.log("Req.body: ", req.body)
        console.log("User Email:" ,email)
        console.log("Password:", password)

        if(!email || !password){
            return res.status(400).send("Missing Fields")
        }

        const extinguiser = await prisma.user.findUnique({
            where: { email }
        })

        if(extinguiser) {
            return res.status(400).send("User already exists")
        }

        const hashedPassword = await bcypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.redirect("/login");

    } catch(err){
        console.error(err);
        res.status(500).send("Server Error!")
    }
}

export default {
    getMemberAuth,
    entryPoint,
    getHome,
    registerUser
}   