const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ny4zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('tourism_Of_Sylhet');
        const productsCollection = database.collection('products');
        const featuresCollection = database.collection('features');
        const ordersCollection = database.collection('orders');

        //GET PRODUCTS API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);

        });
        //
        // app.get('.orders', async (req, res) => {
        //     const cursor = ordersCollection.find({});
        //     const products = await cursor.toArray();
        //     res.send(products)
        // });
        //GET FEATURES API
        app.get('/features', async (req, res) => {
            const cursor = featuresCollection.find({});
            const features = await cursor.toArray();
            res.send(features);

        });
        //Get Single Product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findone(query);
            res.json(product)
        })

        //Get Single features
        app.get('/features/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id)
            const query = { _id: ObjectId(id) };
            const feature = await featuresCollection.findone(query);
            res.json(feature)
        })



        //POST Products API
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });
        //POST Feature features
        app.post('/features', async (req, res) => {
            const feature = req.body;
            console.log('hit the post api', feature);
            const result = await featuresCollection.insertOne(feature);
            console.log(result);
            res.json(result);
        });
        //add Order API
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder)
            res.json(result)
        });

        //Get Order
        app.get('/orders', (req, res) => {
            ordersCollection.find({})
                .toArray((error, documents) => {
                    res.send(documents)
                })
        })


        //DELETE API Orders { email: req.query.email }
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })




        //DELETE API Products { email: req.query.email }
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })
        //DELETE API Order { email: req.query.email }


        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        })
        //DELETE API features
        app.delete('/features/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await featuresCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        //await client.close();
        //hfsdhfuhfudshf
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism of Sylhet server is Running')
});
app.listen(port, () => {
    console.log('Server is Running', port);
})