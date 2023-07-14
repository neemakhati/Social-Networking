const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cosineSimilarity = require("compute-cosine-similarity");
admin.initializeApp();

const firestore = admin.firestore();
const eventsCollection = firestore.collection("Events");

// Create an event
exports.createEvent = functions.https.onRequest((req, res) => {
  const event = req.body; // Assuming the request body contains the event data

  // Save the event to Firestore with the default doc ID generated by Firebase
  eventsCollection
      .add(event)
      .then((ref) => {
        res.status(201).json({
          id: ref.id,
          message: "Event created successfully"});
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
  const eventId = req.params.id; // Assuming
  const updatedEvent = req.body; // Assuming

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
  const eventId = req.params.id; // Ass
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

function calculateSimilarityScore(features1, features2) {
  const similarityScore = cosineSimilarity(features1, features2);
  return similarityScore;
}
// Function to get the top recommended items based on item IDs and user features
async function getTopRecommendedItems(
    itemIds,
    userFeatures,
    numRecommendations = 5) {
  // Fetch the items from the
  const itemSnapshots = await Promise.all(
      itemIds.map((itemId) =>
        admin.firestore().collection("Events").doc(itemId).get()),
  );
  // Extract the item features from the fetched items
  const itemFeatures = itemSnapshots.map((snapshot) => {
    const item = snapshot.data();
    return [item.Genre, item.Location, item.Ratings];
  });
  const scores = [];
  for (let i = 0; i < itemIds.length; i++) {
    const itemId = itemIds[i];
    const itemFeature = itemFeatures[i];
    // Calculate similarity score between user features and item features
    const score = calculateSimilarityScore(userFeatures, itemFeature);
    scores.push({id: itemId, score});
  }
  // Sort items based on similarity score
  scores.sort((a, b) => b.score - a.score);
  // Get top N recommendations
  const topRecommendations = scores.slice(
      0, numRecommendations,
  ).map((item) => item.id);
  // Fetch the recommended items from the database
  const recommendedItemsSnapshot = await admin
      .firestore()
      .collection("Events")
      .where(admin.firestore.FieldPath.documentId(), "in", topRecommendations)
      .get();
  const recommendedItems = recommendedItemsSnapshot.docs.map((doc) =>
    doc.data());
  return recommendedItems;
}
exports.recommendations = functions.https.onRequest(async (req, res) => {
  try {
    const itemIds = req.query.favorites.split(",");
    // Fetch the items from the database based on the provided item IDs
    const itemSnapshots = await Promise.all(
        itemIds.map((itemId) =>
          admin.firestore().collection("Events").doc(itemId).get()),
    );
    // Extract the user features from the fetched items
    const userFeatures = itemSnapshots.map((snapshot) => {
      const item = snapshot.data();
      return [item.Genre, item.Location, item.Ratings];
    });
    // Get the top recommended items based o
    const recommendedItems = await getTopRecommendedItems(itemIds,
        userFeatures);
    res.status(200).json({recommendations: recommendedItems});
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({error: "Failed to fetch recommendations"});
  }
});
