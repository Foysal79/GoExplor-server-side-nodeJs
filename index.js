const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());




// const uri = "mongodb+srv://<username>:<password>@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority";
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority`;




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
     await client.connect();
      const database = client.db("GoExplorDB");
   const servicesCollection = database.collection("allServices");
   const bookingCollection = database.collection("booking");
// all service post 
   app.post('/allServices', async(req, res) => {
    const services = req.body;
    console.log('new services', services);
    const result = await servicesCollection.insertOne(services);
    res.send(result);

   })



  //  singe service
  app.get("/allServices/:id", async(req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result = await servicesCollection.findOne(query);
    res.send(result);
  })
    //// my services page client to database

    app.get("/allServicesUserWise/:email", async(req, res) => {
      const id = req.params.email;
      const query = { 
      
        yourEmail : id,

      }
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
       
    } )

    /// relative data 

    app.get("/allServiceRelativeData/:email", async(req, res) => {
      const id = req.params.email;
      const query = { 
      
        yourEmail : id,

      }
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);

    })

    // app.get('/bookings' , async(req, res) => {
    
    
    //   let query = {};
    //   if(req.query.email)
    //   {
    //     query = {
    //       email : req.query.email ,
    //     }
    //   }
    //   console.log("query", query);
    //   const cursor = bookingCollection.find(query);
    //   const results = await cursor.toArray();
    //   res.send(results);
      
  
    //  })
  

/////// all data server to client site
   app.get('/allServices', async(req, res) => {
    const cursor = servicesCollection.find();
    const results = await cursor.toArray();
    res.send(results);

   } )

   /// update data in client to server

   app.put('/allServices/:id', async(req, res) => {
    const id = req.params.id;
    const updateService = req.body;
    console.log(id, updateService);
    const filter = { _id : new ObjectId(id) };
    const options = {upsert : true}
    const updated = {
      $set:{
        serviceName : updateService.serviceName ,
        pictureURL : updateService.pictureURL ,
        yourName : updateService.yourName ,
        yourEmail : updateService.yourEmail,
        Price : updateService.Price,
        description: updateService.description ,
        serviceArea : updateService.serviceArea,
        ServiceProviderImage : updateService.ServiceProviderImage,
      }
    }

    const result = await servicesCollection.updateOne(filter, updated, options)
    res.send(result);

   } )

 



   /// delate data client to server site 

   app.delete('/allServices/:id', async(req, res) => {
    const id = req.params.id;
    console.log('data base delate id is : ', id);
    const query = { _id: new ObjectId(id)};
    const result = await servicesCollection.deleteOne(query);
    res.send(result);
   } )


  



   //// booking data post client to server site 
   app.post('/booking', async(req, res) => {
    const booking = req.body;
    console.log(booking);
    const result = await bookingCollection.insertOne(booking);
    res.send(result);

   })
   /// booking all data 

   app.get('/bookingsAllData', async(req, res) => {
    const cursor = bookingCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })


 //// bookin status data update

 app.patch('/bookingsAllData/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id : new ObjectId(id)};
  const updatedBooking = req.body;
  console.log(updatedBooking);
  const updateDoc = {
    $set: {
      status : updatedBooking.status,
    }
  }
  const result = await bookingCollection.updateOne(filter, updateDoc);
  res.send(result);



 } )



  


   ///// email wise data 
   app.get('/bookings' , async(req, res) => {
    
    
    let query = {};
    if(req.query.email)
    {
      query = {
        email : req.query.email ,
      }
    }
    console.log("query", query);
    const cursor = bookingCollection.find(query);
    const results = await cursor.toArray();
    res.send(results);
    

   })

   


     
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