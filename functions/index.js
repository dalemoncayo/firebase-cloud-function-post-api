const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const firestore = admin.firestore();
const app = express();

const tweet = 'tweet';

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Middleware to parse JSON
app.use(express.json());

// Create a tweet
app.post('/' + tweet + '/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { name, description } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const newTweet = await firestore.collection(tweet + '_' + studentId).add({
      name,
      description,
      timestamp,
    });

    return res.status(201).json({ id: newTweet.id, message: 'Tweet created successfully' });
  } catch (error) {
    console.error('Error creating tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a tweet
app.get('/' + tweet + '/:studentId/:tweetId', async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const studentId = req.params.studentId;
    const tweetSnapshot = await firestore.collection(tweet + '_' + studentId).doc(tweetId).get();

    if (!tweetSnapshot.exists) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    const tweetData = tweetSnapshot.data();
    return res.status(200).json({ id: tweetSnapshot.id, ...tweetData });
  } catch (error) {
    console.error('Error reading tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all tweet
app.get('/' + tweet + '/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const tweetSnapshot = await firestore.collection(tweet + '_' + studentId).orderBy('timestamp').get();

    const allTweet = [];
    tweetSnapshot.forEach((doc) => {
      const tweetData = doc.data();
      allTweet.push({ id: doc.id, ...tweetData });
    });

    return res.status(200).json(allTweet);
  } catch (error) {
    console.error('Error reading all tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a tweet
app.put('/' + tweet + '/:studentId/:tweetId', async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const studentId = req.params.studentId;
    const { name, description } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    await firestore.collection(tweet + '_' + studentId).doc(tweetId).update({
      name,
      description,
      timestamp,
    });

    return res.status(200).json({ message: 'Tweet updated successfully' });
  } catch (error) {
    console.error('Error updating tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a tweet
app.delete('/' + tweet + '/:studentId/:tweetId', async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const studentId = req.params.studentId;
    await firestore.collection(tweet + '_' + studentId).doc(tweetId).delete();

    return res.status(200).json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error('Error deleting tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Expose Express app as a single Cloud Function:
exports.api = functions.https.onRequest(app);
