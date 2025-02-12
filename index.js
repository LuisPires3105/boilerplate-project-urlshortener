require('dotenv').config();
const express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dns = require('node:dns');
const { error } = require('node:console');

var shortedURLs = {};
var id = 1;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//const hostname = ;

app.use(bodyParser.urlencoded({extended: false}))

app.post('/api/shorturl', function(req, res) {
  //var urlToShorten = req.body.url.slice(7);
  console.log(dns.lookup(new URL(req.body.url).hostname,(err,address,family)=>{
    console.log(`${address} \n ${req.body.url}\n`);
    if(err){
      res.json({ error: 'invalid url' });
    }else{
      shortedURLs[id] = req.body.url;
      res.json({original_url: req.body.url, short_url: id});
      id++;
    }
  }));
});

app.get('/api/shorturl/:id?', function(req,res){
  if(shortedURLs.hasOwnProperty(req.params.id)){
    res.redirect(shortedURLs[req.params.id]);
  } else{
    console.log("ERROR");
    res.json({error: 'No shorten URL found for given input'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
