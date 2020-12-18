const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const randtoken = require('rand-token');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const mongo2 = require('mongodb');
const path = require('path');


const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '8mb', extended: true }));


// Allows cors to work with react
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Connect to DB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/MagicMeds';
const client = new MongoClient(url);
client.connect();



app.use(express.static(path.join(__dirname, 'client', 'public')));

// Direct User to Page when accessing server host
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'))
});



// For signup API
app.post('/api/signUp', async (req, res, next) => {

  // incoming: First name, last name, login, password, email address
  // outgoing: status of signup

  const { login, password, firstName, lastName, email } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({ Login: login }).toArray();

  if (results.length > 0) {
    status = 'User already taken!';
  }

  else {
    // Add credentials to the database here
    var myobj = { Login: login, Password: password, FirstName: firstName, LastName: lastName, Email: email};
    db.collection("Users").insertOne(myobj, function (err, res) {
        if (err)
            throw err;
    });

    status = 'User added to database!';
  }

  var ret = { status: status };
  res.status(200).json(ret);
});

///////////////////////////////////////
// For login API
app.post('/api/login', async (req, res, next) => {
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  var error = '';

  const { login, password } = req.body;

  const db = client.db();
  const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

  var id = -1;
  var fn = '';
  var ln = '';
  var username = '';

  if (results.length > 0) {
    id = results[0]._id;
    fn = results[0].FirstName;
    ln = results[0].LastName;
    username = results[0].Login;



  }
  else {
    error = 'Invalid user name/password';
  }
  var ret = { id: id, firstName: fn, lastName: ln, username: username};
  res.status(200).json(ret);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.listen(5000); // start Node + Express server on port 5000
