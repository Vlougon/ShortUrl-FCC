require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urls = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const fullURL = req.body.url;
  const shortURL = Math.floor(Math.random() * (100 - 1) + 1);

  if (fullURL === null || fullURL === '' || !fullURL.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm)) {
    res.json({ error: 'invalid url' });

  } else {
    urls.push({ original_url: fullURL, short_url: shortURL });
    res.json({ original_url: fullURL, short_url: shortURL });
  };
});

app.get('/api/shorturl/:short_url', function (req, res) {
  if (!req.params.short_url) {
    res.status(404).json({ message: 'wrong url' });
    return
  }

  const urlObject = urls.filter(url => url.short_url === parseInt(req.params.short_url));

  if (urlObject.length === 0) {
    res.status(404).json({ message: 'wrong url' });
  }

  res.redirect(urlObject[0].short_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
