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

    const folders = await getUserFolders(req.user.id);
    // console.log("User folders:", folders)

    // console.log("User in controller:", user)
    res.render('home', {user, folders})
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
    console.log("Creating folder with name: ", req.body.folderName)
    try {   
    await prisma.folder.create({
        data: {
            name: req.body.folderName,
            userId: req.user.id
        }
    })
    res.redirect("/home");
} catch(err){
    console.error("Error creating folder:", err);
}
}

// Read folder
async function getUserFolders(userId) {
    return await prisma.folder.findMany({
        where: { userId },
        include: {
            files: true
        }
    })
}

async function readFolder(req, res) {
    const { folderId } = req.params;
    const folder = await prisma.folder.findUnique({
        where: { id: Number(folderId) },
        include: {
            files: true
        }
    });

    const unfolderedFiles = await getUnfolderedFiles(req.user.id);

    if (!folder) {
        return res.status(404).send("Folder not found");
    }

    res.render("partials/folder-details", { folder, unfolderedFiles });
}

// Update folder
async function updateFolder(req, res) {
    console.log("Update foldr req params: ", req.params)
    const id = parseInt(req.params.folderId);

    const department = await prisma.folder.findUnique({
        where: { id }
    });

    if (!department) {
        return res.status(404).send("Folder not found");
    }

    res.render("partials/edit-folder", { folder: department });
}


async function postFolderEdit(req, res) {
    try {
        const { folderId, newName } = req.body;
        await prisma.folder.update({
            where: {id: parseInt(folderId)},
            data: { name: newName }
        });
        res.redirect("/home");
    } catch (err) {
        console.error("Error updating folder:", err);
        res.status(500).send("Server Error!");
     }
}

// Delete Folder
async function deleteFolder(req, res) {

    try {
        const { folderId } = req.params;
        console.log("Delete folder ID :", folderId)

        await prisma.folder.delete({
        where: { id: Number(folderId)}
    });
    res.redirect("/home")

    } catch (err){
        console.error("Error Deleting Folder")
        res.status(500).send("Error deleting folder")
    }
}

async function getUnfolderedFiles(userId) {
    return await prisma.file.findMany({
        where: {
            userId,
            folderId: null
        }
    });
}

// folder file upload
async function createAndUploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        await createFile({
            filename: req.file.originalname,
            path: req.file.path,
            userId: req.user.id,
            folderId: req.body.folderId ? Number(req.body.folderId) : null

        })

        await setFileFolder(req.body.fileId, req.body.folderId);
        res.redirect("/home");
    } catch (err) {
        console.error("Error creating file:", err);
    }
}

async function createFile(data) {
    return await prisma.file.create({
        data
    })
}

async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        await createFile({
            filename: req.file.originalname,
            path: req.file.path,
            userId: req.user.id,
            folderId: req.body.folderId ? Number(req.body.folderId) : null
        })

        return res.redirect("/home");

    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).send("Server Error!");
    }
}


async function moveFile(req, res) {
    try {
        await setFileFolder(req.body.fileId, req.body.folderId);
        res.redirect("/home");
    } catch (err) {
        console.error("Error moving file:", err);
        res.status(500).send("Server Error!");
    }
}

async function setFileFolder(fileId, folderId) {
    return await prisma.file.update({
        where: { id: Number(fileId) },
        data: { folderId: folderId ? Number(folderId) : null }
    });
}

export default {
    getMemberAuth,
    entryPoint,
    getHome,
    registerUser,
    createFolder,
    getUserFolders,
    readFolder,
    updateFolder,
    deleteFolder,
    createAndUploadFile,
    uploadFile,
    postFolderEdit,
    moveFile
}   