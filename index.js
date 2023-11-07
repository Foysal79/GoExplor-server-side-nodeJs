const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


console.log(" your use name : ",process.env.DB_USER);

// const uri = "mongodb+srv://<username>:<password>@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority";
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority`;


// const database = client.db("ServicesDB");
//     const userCollection = database.collection("allServices");


    // app.post('/users', async(req, res) => {
    //     const user = req.body;
    //     console.log('new user', user);
    //     const result = await userCollection.insertOne(user);
    //     res.send(result);


    // })

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('welcome to GoExplor')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})