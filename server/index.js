const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// create application/json parser
const jsonParser = bodyParser.json()

let events = [];

// get all events
app.get("/api/events", (req, res) => {
  res.send(events)
});

// get an event by id
app.get("/api/events/:eventId", (req, res) => {
  const id = req.params.eventId;
  res.send(events.filter(event => event.eventId === id))
});

// get all event ids
app.get("/api/ids/", (req, res) => {
  res.send(events.map(event => event.eventId))
});

// post new event
app.post('/api/new-event',jsonParser, function(req, res) {
  const eventId = req.body.eventId;
  const eventDate = req.body.eventDate;
  const eventName = req.body.eventName;
  const eventStartTime = req.body.eventStartTime;
  const eventEndTime = req.body.eventEndTime;
  const eventLocation = req.body.eventLocation;
  const eventOrganizer = req.body.eventOrganizer;
  const eventAttendees = req.body.eventAttendees;
  const eventSpecialGuests = req.body.eventSpecialGuests;
  const eventNonAttendees = req.body.eventNonAttendees;
  
  events = [...events, {
    "eventId": eventId,
    "eventDate": eventDate,
    "eventName": eventName,
    "eventStartTime": eventStartTime,
    "eventEndTime": eventEndTime,
    "eventLocation": eventLocation,
    "eventOrganizer": eventOrganizer,
    "eventAttendees": eventAttendees,
    "eventSpecialGuests": eventSpecialGuests,
    "eventNonAttendees": eventNonAttendees
  }]
  res.send("Event added");
});

// update RSVP info for an event by id
app.patch("/api/events/:eventId", (req, res) => {
  const id = req.params.eventId;
  
  const eventAttendees = req.body.eventAttendees;
  const eventSpecialGuests = req.body.eventSpecialGuests;
  const eventNonAttendees = req.body.eventNonAttendees;

  const targetEvent = events.filter(event => event.eventId === id)[0];

  targetEvent.eventAttendees = eventAttendees;
  targetEvent.eventSpecialGuests = eventSpecialGuests;
  targetEvent.eventNonAttendees = eventNonAttendees;
  
  res.send("Event updated")
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});