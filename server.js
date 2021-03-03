const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const randtoken = require('rand-token');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const mongo2 = require('mongodb');
const path = require('path');
const schedule = require('node-schedule');
const { exit } = require('process');
const rule = new schedule.RecurrenceRule();

/////////////////////////////////////////
// Added for Heroku deployment.
const PORT = process.env.PORT || 5000;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '8mb', extended: true }));

/////////////////////////////////////////
// Added for Heroku deployment.
app.set('port', (process.env.PORT || 5000));

// Allows cors to work with react
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Connect to DB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://Steven:XO9V<Bpf)bGCNfKEX.6P0h!Z@cluster0.tjzfa.mongodb.net/MedMaster?retryWrites=true&w=majority';
const client = new MongoClient(url, { useUnifiedTopology: true });
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

  const { login, password, firstName, lastName, email, productCode } = req.body;
  const db = client.db();
  const results = await db.collection('Users').find({ Login: login }).toArray();

  if (results.length > 0) {
    status = 'User already taken!';
  }

  else {
    // Add credentials to the database here
    var myobj = { Login: login, Password: password, FirstName: firstName, LastName: lastName, Email: email, ProductCode: productCode};
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


///////////////////////////////////////
// For adding caregiver API
app.post('/api/addcare', async (req, res, next) => {
    // incoming: firstname, lastname, phone-number
    // outgoing: status

    var error = '';
    var caregivername = '';
    const { firstName, lastName, phoneNumber, userId } = req.body;

    const db = client.db();
    const doesExistInPool = await db.collection('AvailableCaregivers').find({ FirstName: firstName, LastName: lastName, PhoneNumber: phoneNumber }).toArray();
    const results = await db.collection('Caregivers').find({ FirstName: firstName, LastName: lastName, PhoneNumber: phoneNumber, UserId: userId }).toArray();

    
    if (doesExistInPool.length == 1)
    {
        if (results.length > 0)
            status = 'Caregiver already added!';

        else {
            // Add credentials to the database here
            var myobj = { FirstName: firstName, LastName: lastName, PhoneNumber: phoneNumber, UserId: userId };
            db.collection("Caregivers").insertOne(myobj, function (err, res) {
                if (err)
                    throw err;
            });

            status = 'Caregiver added to database!';
            caregivername = firstName;
        }
    }
    else
        status = doesExistInPool

    var ret = { status: status, caregivername: caregivername };
    res.status(200).json(ret);
});

///////////////////////////////////////
// For getting caregiver API
app.post('/api/getcare', async (req, res, next) => {
    // incoming: userid
    // outgoing: all caretakers for that id

    var error = '';
    const { userId } = req.body;

    const db = client.db();
    const results = await db.collection('Caregivers').find({ UserId: userId }).toArray();

    if (results.length <= 0) {
        status = 0;
    }

    else {
        var arrayofcaregivers = results;
        status = 1;
    }

    var ret = { status: status, caregivers: arrayofcaregivers};
    res.status(200).json(ret);
});

///////////////////////////////////////
// For adding med API
app.post('/api/addmed', async (req, res, next) => {

    var error = '';
    const { medicationName, dayTaken, timeTaken, dosage, userId } = req.body;
    const db = client.db();
    const results = await db.collection('Medications').find({ MedicationName: medicationName, DayTaken: dayTaken, TimeTaken: timeTaken, UserId: userId }).toArray();

    const sameDay = await db.collection('Medications').find({ DayTaken: dayTaken, UserId: userId }).toArray();
    const sameTime = await db.collection('Medications').find({ TimeTaken: timeTaken, UserId: userId }).toArray();
    const everydayMeds = await db.collection('Medications').find({ DayTaken: "Everyday", UserId: userId }).toArray();


    if ((sameDay.length > 0 || everydayMeds.length > 0) && sameTime == 0)
        status = 'Ensure medications on the same day are set to drop at the same time!';

    else if (results.length > 0)
        status = 'That medication has already been added for that time!';
    else {
        // Add credentials to the database here
        var myobj = { MedicationName: medicationName, DayTaken: dayTaken, TimeTaken: timeTaken, Dosage: dosage, UserId: userId };
        db.collection("Medications").insertOne(myobj, function (err, res) {
            if (err)
                throw err;
        });

        status = 'Medication added to database!';
    }

    var ret = { status: status };
    res.status(200).json(ret);
});

///////////////////////////////////////
// For getting med API
app.post('/api/getmed', async (req, res, next) => {
    // incoming: userid
    // outgoing: all meds for that id

    var error = '';
    const { userId } = req.body;

    const db = client.db();
    const results = await db.collection('Medications').find({ UserId: userId }).toArray();

    if (results.length <= 0) {
        status = 0;
    }

    else {
        var arrayofmeds = results;
        status = 1;
    }

    var ret = { status: status, meds: arrayofmeds };
    res.status(200).json(ret);
});

///////////////////////////////////////
// For getting med API
app.post('/api/deletemed', async (req, res, next) => {
    // incoming: medid
    // outgoing: status of deletion - 1 for success, 0 for not deleted.

    var error = '';
    const { medicationId } = req.body;

    const db = client.db();
    var objectMedId = new mongo2.ObjectID(medicationId);
    const results = await db.collection('Medications').find({ _id: objectMedId }).toArray();

    if (results.length <= 0) {
        status = 2;
    }

    else {
        db.collection('Medications').deleteOne({ _id: objectMedId }, function (err, obj) {
            if (err)
                status = 0;
        });
        status = 1;
    }

    var ret = { status: status};
    res.status(200).json(ret);
});

///////////////////////////////////////
// For getting med API
app.post('/api/deletecare', async (req, res, next) => {
    // incoming: medid
    // outgoing: status of deletion - 1 for success, 0 for not deleted.

    var error = '';
    const { careId } = req.body;

    const db = client.db();
    var objectCareId = new mongo2.ObjectID(careId);
    const results = await db.collection('Caregivers').find({ _id: objectCareId }).toArray();

    if (results.length <= 0) {
        status = 2;
    }

    else {
        db.collection('Caregivers').deleteOne({ _id: objectCareId }, function (err, obj) {
            if (err)
                status = 0;
        });
        status = 1;
    }

    var ret = { status: status };
    res.status(200).json(ret);
});

///////////////////////////////////////
// For adding caregiver API
app.post('/api/addCaregivertopool', async (req, res, next) => {

    var error = '';
    const { firstName, lastName, phoneNum, phoneCarrier } = req.body;
    const db = client.db();
    const results = await db.collection('AvailableCaregivers').find({ FirstName: firstName, LastName: lastName, PhoneNumber: phoneNum, PhoneCarrier: phoneCarrier }).toArray();

    if (results.length > 0)
        status = 'Caregiver already added!';
    else {
        // Add credentials to the database here
        var myobj = { FirstName: firstName, LastName: lastName, PhoneNumber: phoneNum, PhoneCarrier: phoneCarrier };
        db.collection("AvailableCaregivers").insertOne(myobj, function (err, res) {
            if (err)
                throw err;
        });

        status = 'Caregiver added to database!';
    }

    var ret = { status: status };
    res.status(200).json(ret);
});

var listOfCarriers = ["@tmomail.net"]
// Monitor DB
const job = schedule.scheduleJob('*/5 * * * * *', function () {

   
    arrayofData = []
    const db = client.db();
    const medicine = db.collection('Medications').find({}).toArray().then(function (resultmed) {
        for (i = 0; i < resultmed.length; i++) {
            var thetime = getDate();
            var dayTime = resultmed[i].DayTaken + " " + resultmed[i].TimeTaken + ":00"

            // If the current time matches the time the medication needs to be taken, launch into notifying the caregiver.
            // Currently, if user has multiple meds for 1 time, it will send a text for each
            if (dayTime == thetime)
            {
                var objectUserId = new mongo2.ObjectID(resultmed[i].UserId);
                const usersMed = db.collection('Users').find({ _id: objectUserId }).toArray().then(function (resultusers) {
                    console.log(resultusers[0].Login);
                    var objectasstring = new mongo2.ObjectID(resultusers[0]._id).toString();
                    console.log(objectasstring);
                    const usersCareGivers = db.collection('Caregivers').find({ UserId: objectasstring }).toArray().then(function (resultcare) {
                        // Need to loop through the list of caregivers, find them in available and send each a text stating the meds dropped. 
                        console.log(resultcare[0]);
                        const usersCareGivers = db.collection('AvailableCaregivers').find({ FirstName: resultcare[0].FirstName, LastName: resultcare[0].LastName, PhoneNumber: resultcare[0].PhoneNumber}).toArray().then(function (assigncareresult) {
                            console.log(assigncareresult[0]);
                            if (assigncareresult.length > 0) {
                                sendMail(assigncareresult[0].PhoneCarrier)
                            }
                        })
                    })
                });
     
            }         
            else
                console.log("no")
        }
        
    });
});

async function sendMail(phoneCarrier) {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'magicmedsnotif@gmail.com',
            pass: 'gaEbr8MYRZzoyxQ9sd2k'
        }
    }));

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"MagicMeds" <do-not-reply@magicmeds.com>', // sender address
        to: "3524034106@tmomail.net", // list of receivers
        subject: "Pill drop alert!!💊 ", // Subject line
        text: "Hello", // plain text body
        html: "<p>Pill Drop Allert</p>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}


function getDate() {
    var date = new Date();
    var timeFormat = date.toLocaleTimeString();
    var day = ''

    if (date.getDay() == 0)
        day = "Sunday";
    if (date.getDay() == 1)
        day = "Monday";
    if (date.getDay() == 2)
        day = "Tuesday";
    if (date.getDay() == 3)
        day = "Wednesday";
    if (date.getDay() == 4)
        day = "Thursday";
    if (date.getDay() == 5)
        day = "Friday";
    if (date.getDay() == 6)
        day = "Saturday";

    var finalTime = day + " " + calculateTime(timeFormat);

    return finalTime;
}

function calculateTime(thetime) {
    var sub = thetime.split(":");
    var hour = sub[0];
    var minutes = sub[1];
    var pm = sub[2].split(" ");
    var seconds = pm[0]
    var newtime = "";

    if (parseInt(hour) == 12)
        newtime = '00:' + minutes + ':00'

    else if (pm[1] === 'PM')
        newtime = parseInt(hour) + 12 + ':' + minutes + ':' + seconds

    return newtime;
}

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


///////////////////////////////////////////////////
// For Heroku deployment
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

///////////////////////////////////////////////////
// For Heroku deployment
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
});

//app.listen(5000); // start Node + Express server on port 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

