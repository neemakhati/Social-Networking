const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();
const eventsCollection = firestore.collection("Events");

// Create an event
exports.createEvent = functions.https.onRequest((req, res) => {
  const event = req.body;
  eventsCollection
      .add(event)
      .then((ref) => {
        res.status(201).json({
          id: ref.id,
          message: "Event created successfully",
        });
      })
      .catch((error) => {
        res.status(500).json({error: "Failed to create event"});
      });
});
// Read all events
exports.getEvents = functions.https.onRequest((req, res) => {
  const location = req.query.location;
  let query = eventsCollection;
  if (location) {
    query = query.where("Location", "==", location);
  }
  query
      .get()
      .then((snapshot) => {
        const events = [];
        snapshot.forEach((doc) => {
          const event = {
            id: doc.id,
            ...doc.data(),
          };
          events.push(event);
        });
        res.status(200).json(events);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        res.status(500).json({error: "Failed to fetch events"});
      });
});

// Read a single event
exports.getEvent = functions.https.onRequest((req, res) => {
  const eventId = req.query.id; // Assuming the event ID i
  if (!eventId) {
    res.status(400).json({error: "Event ID is missing"});
    return;
  }
  eventsCollection
      .doc(eventId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const event = {
            id: doc.id,
            ...doc.data(),
          };
          res.status(200).json(event);
        } else {
          res.status(404).json({error: "Event not found"});
        }
      })
      .catch((error) => {
        console.error("Failed to fetch event:", error);
        res.status(500).json({error: "Failed to fetch event"});
      });
});
// Update an event
exports.updateEvent = functions.https.onRequest((req, res) => {
  const eventId = req.query.id; 
  const updatedEvent = req.body; 

  eventsCollection
      .doc(eventId)
      .update(updatedEvent)
      .then(() => {
        res.status(200).json({message: "Event updated successfully"});
      })
      .catch((error) => {
        res.status(500).json({error: "Failed to update event"});
      });
});

// Delete an event
exports.deleteEvent = functions.https.onRequest((req, res) => {
  const eventId = req.query.id; //
  if (!eventId) {
    return res.status(400).json({
      error: "Event ID is missing in the query parameters"});
  }

  eventsCollection
      .doc(eventId)
      .delete()
      .then(() => {
        res.status(200).json({message: "Event deleted successfully"});
      })
      .catch((error) => {
        res.status(500).json({error: "Failed to delete event"});
      });
});


// Manual cosine similarity function for single value
function cosineSimilarity(str1, str2) {
  const words1 = str1.toLowerCase().split(/\W+/).filter((word) =>
    word.length > 0);
  const words2 = str2.toLowerCase().split(/\W+/).filter((word) =>
    word.length > 0);

  const wordSet = new Set([...words1, ...words2]);

  const vector1 = [];
  const vector2 = [];

  for (const word of wordSet) {
    vector1.push(words1.includes(word) ? 1 : 0);
    vector2.push(words2.includes(word) ? 1 : 0);
  }

  return dotProduct(
      vector1, vector2) / (magnitude(vector1) * magnitude(vector2));
}

function dotProduct(vector1, vector2) {
  return vector1.reduce((sum, value, index) =>
    sum + value * vector2[index], 0);
}

function magnitude(vector) {
  return Math.sqrt(vector.reduce((sum, value) =>
    sum + value * value, 0));
}

exports.getRecommendations = functions.https.onRequest(async (req, res) => {
  try {
    const eventIds = req.query.ids;

    if (!eventIds) {
      return res.status(400).json({
        error: "Missing event IDs in the query parameters."});
    }

    const eventIdsArray = eventIds.split(",");

    // Fetch events data from Firestore collection "Events"
    const db = admin.firestore();
    const eventsSnapshot = await db.collection("Events").get();
    const eventsData = eventsSnapshot.docs.map((doc) => {
      const eventData = doc.data();
      return {id: doc.id, ...eventData};
      // Use Firestore document ID as the event ID
    });

    // Find the selected events
    // based on the provided event IDs
    const selectedEvents = eventsData.filter((event) =>
      eventIdsArray.includes(event.id));

    if (selectedEvents.length === 0) {
      return res.status(404).json({
        error: "No events found for the given IDs."});
    }

    // Calculate cosine similarity for each selected event
    const recommendations = selectedEvents.map((selectedEvent) => {
      const selectedGenre = selectedEvent.Genre;

      const eventsWithSimilarity = eventsData.map((item) => {
        if (item.id === selectedEvent.id) {
          return {...item, similarity: 1};
        } else if (item.Genre === selectedGenre) {
          const similarity = cosineSimilarity(selectedGenre, item.Genre);
          return {...item, similarity};
        } else {
          return {...item, similarity: 0};
        }
      });

      // Filter and sort events based on similarity and ratings
      const similarityThreshold = 0.1; // Adjust this threshold as needed
      const filteredEvents = eventsWithSimilarity.filter((item) => {
        return item.similarity >= similarityThreshold && item.Ratings >= 2;
      });

      // Sort the events based on similarity and ratings
      const sortedEvents = filteredEvents.sort((a, b) => {
        // Sort by similarity first, then by ratings
        if (a.similarity === b.similarity) {
          return b.Ratings - a.Ratings;
        }
        return b.similarity - a.similarity;
      });

      return {selectedEvent, recommendations: sortedEvents};
    });

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({error: "Internal server error."});
  }
});
