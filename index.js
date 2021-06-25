const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sioj4.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const postCollection = client.db("blogino").collection("posts");

    console.log(err);

    // Add Post 
    app.post('/addPost', (req, res) => {
        const post = req.body;
        postCollection.insertOne(post)
            .then(results => {
                res.send(results.insertedCount > 0)
            })
    })

    // Read Posts
    app.get('/posts', (req, res) => {
        postCollection.find({})
            .toArray((err, posts) => {
                res.send(posts)
            })
    })

    // Update Status
    app.patch('/updateStatus/:id', (req, res) => {
        const id = ObjectId(req.params.id)
        const body = req.body

        postCollection.findOneAndUpdate(
            { _id: id },
            { $set: { status: body.status } }
        )
            .then(result => {
                res.send(result.ok > 0)
            })
            .catch(err => {
                console.log(err);
            })
    })

    app.get('/', function (req, res) {
        res.send('hello world')
    });



})
app.listen(process.env.PORT || 5000);

