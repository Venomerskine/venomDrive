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
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id},
        include: {
            files: true
        }
    });

    // console.log("User in controller:", user)
    res.render('home', {user})
}

async function registerUser(req, res) {
    try{
        const { email, password} = req.body;
        
        // Dunda wire testing
        // console.log("Req.body: ", req.body)
        // console.log("User Email:" ,email)
        // console.log("Password:", password)

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

// Create Folder
async function createFolder (req, res){
    await prisma.folder.create({
        data: {
            name: req.body.name,
            userId: req.user.id
        }
    })
}

// Read folder
async function readFolder(req, res) {
    const folders = await prisma.folder.findMany({
        where: { userId: req.user.id },
        include: { file: true }
    });
}

// Update folder
async function updateFolder(req, res) {
    const { folderId, newName } = req.body;
    await prisma.folder.update({
        where: {id: folderId},
        data: { name: newName }
})
}

// Delete Folder
async function deleteFolder(req, res) {
    const { folderId } = req.body;
    await prisma.folder.delete({
    where: { id: folderId}
})
}

// folder file upload
async function uploadFile(req, res) {
    await prisma.file.create({
        data: {
            filename: req.file.filename,
            path: req.file.path,
            userId: req.user.id,
            folderId: req.body.folderId || null
    }
})
}

export default {
    getMemberAuth,
    entryPoint,
    getHome,
    registerUser,
    createFolder,
    readFolder,
    updateFolder,
    deleteFolder,
    uploadFile
}   