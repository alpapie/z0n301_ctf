const express = require('express')
const app = express()

const cors = require('cors');

require('dotenv').config()

app.use(cors());

app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Erreur JSON détectée:', err.message);
        return res.status(400).json({ error: 'Le corps de la requête contient un JSON invalide.',type:"syntaxe" });
    }
    next(err); 
});

app.use('/admin', require("./routes/admin.js"))

app.use("/api", require("./routes/user.js") )

app.get('*',(req, res)=>{
    res.status(404).json({error:"not fund"})
})

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`)
})