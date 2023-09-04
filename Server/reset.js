const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.DATABASEKEY || "mongodb+srv://ADMIN:Teunjoppedaan1@file-server.cb2oiri.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const Client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1, strict: true, deprecationErrors: true,}});
Client.connect().then(() => {Client.db("File-Server").collection("Nederlands_Onderzoek").deleteMany({})});

