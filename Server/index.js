const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
app.use(express.text());

const uri = "mongodb+srv://ADMIN:Teunjoppedaan1@file-server.cb2oiri.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const Client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1, strict: true, deprecationErrors: true,}});

const port = 3000;

app.post('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    const DATA = JSON.parse(req.body);
    Client.connect().then(() => {Client.db("File-Server").collection("Nederlands_Onderzoek").insertOne(DATA);});

    res.status = 200;
    res.send("GOT DATA");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});