const express = require('express');
const app = express()
const port =process.env.PORT || 5000;
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors())
app.use(express.json())

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)

})







const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.ak91fsl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
const database = client.db("studentDB");
const studentCollection = database.collection('students')

app.get('/',async(req,res) => {
  
  const cursor =studentCollection.find()
  const allStudents =await cursor.toArray();
  res.send(allStudents)
})

app.get('/:id',async(req,res) =>{
  const id =req.params.id
 
  const query={_id:new ObjectId(id)}
  const result =await studentCollection.findOne(query)
  res.send(result)
  console.log(result)
})

app.put('/update/:id',async(req,res) =>{
  const id =req.params.id
  const data= req.body 
  console.log("info" ,id)
  const options ={upsert:true}
  const filter={_id:new ObjectId(id)}
  console.log(data)
  const updatedInfo ={
    $set:{
      name:data.name,
      college:data.college,
      photo:data.photo,
      batch:data.batch,
      phone:data.phone
    }
  }
  const result=await studentCollection.updateOne(filter,updatedInfo,options)
  res.send(result)
})

app.delete('/delete/:id',async(req,res) => {
  const id =req.params.id
  const query={_id:new ObjectId(id)}
  const result= await studentCollection.deleteOne(query);
  res.send(result)
  console.log(id)
})

app.post('/add',async(req,res) => {
  
  const student = req.body;
  console.log(student)
  const result =await studentCollection.insertOne(student)
  res.send(result)
})





    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
