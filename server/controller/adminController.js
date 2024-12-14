const Admin = require('../models').Admin
const User = require('../models').User

const { Sequelize } = require('sequelize');
let createSHA256Hash = require("../utils/hash.js")
const jwt = require('jsonwebtoken');
const { recordLoginAttempt, isMaliciousInput, canAttemptLogin } = require('../utils/trolle.js');
let secret_jwt = process.env.JWT_SECRET
let form_token = process.env.FORM_TOKEN
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const trollGifs = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXFqczhzYjg3cWtmZDZvcjd4cm0xbGJodzVhcGdhMG56Mm56Nm5zaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VL48WGMDjD64umCEkv/giphy.gif",
    "https://media.giphy.com/media/3og0IJXQEKwIdIEYpy/giphy.gif?cid=790b7611uqjs8sb87qkfd6or7xrm1lbhw5apga0nz2nz6nsh&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/3o6Zt4HU9uwXmXSAuI/giphy.gif?cid=790b7611ixyh34v5eicfjb4ayhhvlie4t1mnl210xh7qqan6&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmloaGx6a3h2bmRpa3RrNWs4azFpOWZnb3YyMXpvZWlldzBxdWV0ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zCpYQh5YVhdI1rVYpE/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDlqcmZhNjdzZTBnbG13d3VmcjR0ajFsN2gwbmp2emx0dG01Z2Y5MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nNxT5qXR02FOM/giphy.gif",
    "https://media.giphy.com/media/l0IybQ6l8nfKjxQv6/giphy.gif?cid=ecf05e4799ykdidxepe1gdiu158483zf27kknsa7i1f4kbpo&ep=v1_gifs_related&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3V4YTdvMmwxZ2Vqa2xyYXNxeDM0c3FkcWJlcGx2MDhkdml6bnQ5MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEduMw4Nd2j2iLk2c/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3FxbHZ3dWJ6ODU2M2I0emV1OHg4MnFyZWlvMnEwcGd2NnprZG16eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BpX6RB6YFcx7q/giphy.gif"
];
const trollSounds = [
    "rice.mp3",
    "Matswele.mp3",

];
let login = async (req, res) => {
    try {
        const randomGif = trollGifs[Math.floor(Math.random() * trollGifs.length)];
        const randomSound = trollSounds[Math.floor(Math.random() * trollSounds.length)];
        if (req.body) {
            let { login, password } = req.body
            if (!canAttemptLogin(login)) {
                const trollMessages = [
                    "Erreur 418 : Je suis une théière ☕️.",
                    "Hmm, c'est pas très discret comme brute force 🤔.",
                    "Besoin d'aide pour trouver votre mot de passe ? Essayez 'password123' 😂.",
                    "Vous êtes bloqué temporairement. Revenez dans quelques minutes 🕒.",
                ];
                const trollMessage = trollMessages[Math.floor(Math.random() * trollMessages.length)];
                return res.status(429).json({ error: trollMessage ,type:"brute force", gif: randomGif, sound: randomSound });
            }

            if (isMaliciousInput(login) || isMaliciousInput(password)) {
                await sleep(2000);
                return res.status(400).json({ error: 'Nous avons détecté une tentative d\'injection 😈. Bonne chance pour la prochaine fois!', type:"injection" , gif: randomGif, sound: randomSound});
            }

           
            let hash = createSHA256Hash(`${login}:${password}`)
            Admin.findOne({ where: { hash } }).
                then(async user => {
                    if (user) {
                        const token = jwt.sign({ userId: user.id }, secret_jwt, {
                            expiresIn: '24h',
                        });
                        return res.status(200).json({ token });
                    }
                    await sleep(2000);
                    return res.status(401).json({ error: 'Authentication failed login or password incorrect' });
                })
                .catch( async err => {
                    await sleep(2000);
                    return res.status(401).json({ error: 'Authentication failed login or password incorrec' });
                })
        }
    } catch (error) {
        await sleep(2000);
        recordLoginAttempt(req.body?.login); 
        console.log(error);
        
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

let register = async (req, res) => {
    try {
        let token = req.body?.token || ""
        if (form_token !== createSHA256Hash(token)) {
            return res.status(401).json({ error: 'Authentication failed token' })
        }

        const usersData = req.body?.users;

        if (!Array.isArray(usersData)) {
            return res.status(400).json({ error: 'Le corps de la requête doit être un tableau de données utilisateur.' });
        }

        for (const userData of usersData) {
            try {
                userData.point=0
                if (!userData.nom || !userData.prenom || !userData.login || !userData.email) {
                    console.error(`Utilisateur invalide :`, userData);
                    return res.status(401).json({ error: 'Failed create users' })
                }
                const user = await User.create(userData);
                console.log(`Utilisateur ajouté : ${user.nom} ${user.prenom}`);
            } catch (error) {
                console.error('Erreur lors du traitement du fichier JSON:', error.message);
                return res.status(401).json({ error: 'Failed create users' })
            }
        }

        return res.status(200).json({ success: "user create successful" });
    } catch (err) {
        console.error('Erreur lors du traitement du fichier JSON:', err.message);
        return res.status(401).json({ error: 'Failed create users' })
    }
}

let updatePoints = async (req, res) => {
    try {

        const { userIds, point,token } = req.body;
        if (form_token !== createSHA256Hash(token||"")) {
            return res.status(401).json({ error: 'Authentication failed token' })
        }

        console.log(userIds);
        
        if (!Array.isArray(userIds) || typeof point !== 'number') {
            return res.status(400).json({ error: 'La requête doit contenir un tableau d\'ID d\'utilisateurs et un nombre de points à ajouter.' });
        }

        const usersUpdated = await User.update(
            {
                point: Sequelize.literal(`point + ${point}`),
            },
            {
                where: {
                    id: userIds,
                },
                
            }
        );

        if (usersUpdated[0] === 0) {
            return res.status(404).json({ error: 'Aucun utilisateur trouvé avec les ID spécifiés.' });
        }

        res.status(200).json({ message: `Points mis à jour pour ${usersUpdated[0]} utilisateur(s).` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour des points.' });
    }
}


let dashboard=(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

let auth=(req,res)=>{
    return res.status(200).json({ message: `auth` });
}
module.exports = { login, register,updatePoints ,dashboard,auth}
