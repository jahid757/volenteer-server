const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT ||5000
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9mirr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  console.log(`Database Connected With ${port}`)

    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray( (err,events) => {
            res.send(events)
        })
    })

    app.post('/addEvent',(req,res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count'+result.insertedCount)
            res.send(result.insertedCount > 0)
        })
        
    })

    app.delete('/deleteEvent/:id',(req,res) => {
        const id = ObjectID(req.params.id)
        console.log('delete this' , id);
        eventCollection.findOneAndDelete({_id:id})
        .then(res.send(!!document.value))
    })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)