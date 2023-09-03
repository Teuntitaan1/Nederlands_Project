const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
app.use(express.text());

const uri = process.env.DATABASEKEY;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const Client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1, strict: true, deprecationErrors: true,}});
Client.connect().then(() => {console.log("Database connected!")});

const port = 3000;

app.post('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    const DATA = JSON.parse(req.body);
    Client.connect().then(() => {Client.db("File-Server").collection("Nederlands_Onderzoek").insertOne(DATA).then(() => {console.log("Succesfully inserted data into database")});});

    res.status = 200;
    res.send("GOT DATA");

    console.log("Got a new Entry in our database!");
});

app.get('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    const DATA = JSON.stringify( await Client.connect().then(() => {Client.db("File-Server").collection("Nederlands_Onderzoek").find({})}));

    res.status = 200;
    res.send(DATA);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});