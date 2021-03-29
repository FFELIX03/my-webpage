import express from 'express';
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express(); //initialize an express instance
app.use(express.static(path.join(__dirname, '/build'))); //where to serve static files such as images
app.use(bodyParser.json());

//define endpoints
/*
app.get('/hello', (req, res) => res.send(`Hello ${req.body.name}`)); // /hello endpoint returns a message 
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`)) // /hello/:name returns a name in the parameter ie. /hello/fernando => hello fernando
app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}`)); // /hello as a post method will output hello and whatever name is in the json body 
*/

app.get('/api/articles/:name', async (req, res) => {
    try {
    const articleName = req.params.name;
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }); //default port for mongodb, second parameter is required, create a client object
    const db = client.db('my-webpage'); //get our db

    const articleInfo = await db.collection('articles').findOne({name: articleName});

    res.status(200).json(articleInfo);

    client.close();
    } catch(error) {
        res.status(500).json({ message: "Error", error});
    }

app.post('/api/articles/:name/upvote', async (req, res) => {
    try{
    const articleName = req.params.name;
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('my-webpage');

    const articleInfo = await db.collection('articles').findOne({name: articleName})
    await db.collection('articles').updateOne({ name: articleName }, 
        { '$set': {
            upvotes: articleInfo.upvotes + 1,
        },
        })

    const updateArticleInfo = await db.collection('articles').findOne({name: articleName})

    res.status(200).json(updatedArticleInfo);
    client.close();
    } catch (error) {
        res.status(500).json({message: "error", error});
        
    }

});






} )

app.get('*', (req,res) =>{

    res.sendFile(path.join(__dirname + '/build/index.html'));
})
app.listen(8000, () => console.log("app is listening on port 8000!")) //starts on port 8000, callback once port is listening in this case just a message

