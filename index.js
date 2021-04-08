var express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;


var app = express()
app.use(bodyParser.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e0z6a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  app.post('/addProducts',(req, res) => {
      const products = req.body;
      productsCollection.insertMany(products)
      .then(result => {
          res.send(result.insertedCount)
      })
  })

  app.get('/products',(req, res) => {
    productsCollection.find({})
    .toArray( (error, documents) => {
      res.send(documents)
    })
  })
  app.get('/product/:key',(req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (error, documents) => {
      res.send(documents)
    })
  })


  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in :productKeys}})
    .toArray( (error, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder',(req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})


});


app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(5000)