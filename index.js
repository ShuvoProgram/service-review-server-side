const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.iqotg9c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('gotravel').collection('services');
        const reviewCollection = client.db('gotravel').collection('review');

        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).sort({_id: -1});
            const services = await cursor.limit(3).toArray();
            // const count = await serviceCollection.estimatedDocumentCount();
            res.send(services);
        })

        //service api
        app.post('/service', async (req, res) => {
            const addService = req.body;
            const result = await serviceCollection.insertOne(addService);
            res.send(result)
        })

        app.get('/services', async(req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.skip(page*size).limit(10).toArray();
            const count = await serviceCollection.estimatedDocumentCount();
            res.send({ count, services });
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })

        //review api
        app.post('/review', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.get('/review', async(req, res) => {
            // const reviewId = req.params.id;
            // const query = { _id: ObjectId(reviewId)};
            const query = {};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.delete('/review/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Server running....')
})

app.listen(port, () => {
    console.log(`server is running On Port ${port}`)
})