const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create application/json parser
const jsonParser = bodyParser.json();

// mongodb setup info
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://kru:krutarth@cluster0.tchyzxp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

// Connect with mongodb client before running below function to retrieve events from db
function getEventsFromDB() {
  let eventsArr = client.db('jot_database').collection('events').find({}).toArray();
  return eventsArr;
}

app.get("/api/ids/", (req, res) => {

  client.connect()
    .then(() => getEventsFromDB())
    .then(events => res.send(events.map(events => events.eventId)))
})

// get an event by id
app.get("/api/events/:eventId", (req, res) => {

  getEventsFromDB()
    .then(events => res.send(events.filter(event => event.eventId === req.params.eventId)))
});

// post new event
app.post('/api/new-event', jsonParser, function (req, res) {

  client.connect()
    .then(() => {
      client.db('jot_database').collection('events').insertOne({
        "eventId": req.body.eventId,
        "eventDate": req.body.eventDate,
        "eventName": req.body.eventName,
        "eventStartTime": req.body.eventStartTime,
        "eventEndTime": req.body.eventEndTime,
        "eventLocation": req.body.eventLocation,
        "eventOrganizer": req.body.eventOrganizer,
        "eventAttendees": req.body.eventAttendees,
        "eventSpecialGuests": req.body.eventSpecialGuests,
        "eventNonAttendees": req.body.eventNonAttendees
      })
    })
    .then(() => {
      res.send("Event added");
    })
});

// update RSVP info for an event by id
app.patch("/api/events/:eventId", (req, res) => {

  const query = { eventId: req.params.eventId }
  const updates = {
    $set: {
      eventAttendees: req.body.eventAttendees,
      eventSpecialGuests: req.body.eventSpecialGuests,
      eventNonAttendees: req.body.eventNonAttendees
    }
  }

  client.connect()
    .then(() => {
      client.db('jot_database').collection('events').updateOne(query, updates)
    })
    .then(() => {
      res.send("Event updated");
    })

});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;
