const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const firestore = admin.firestore();
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Middleware to parse JSON
app.use(express.json());

// Create a post
app.post('/post', async (req, res) => {
  try {
    const { description } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const newPost = await firestore.collection('post').add({
      description,
      timestamp,
    });

    return res.status(201).json({ id: newPost.id, message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a post
app.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const postnapshot = await firestore.collection('post').doc(postId).get();

    if (!postnapshot.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postData = postnapshot.data();
    return res.status(200).json({ id: postnapshot.id, ...postData });
  } catch (error) {
    console.error('Error reading post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all post
app.get('/post', async (req, res) => {
  try {
    const postSnapshot = await firestore.collection('post').get();

    const allpost = [];
    postSnapshot.forEach((doc) => {
      const postData = doc.data();
      allpost.push({ id: doc.id, ...postData });
    });

    return res.status(200).json(allpost);
  } catch (error) {
    console.error('Error reading all post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a post
app.put('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { description } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    await firestore.collection('post').doc(postId).update({
      description,
      timestamp,
    });

    return res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a post
app.delete('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    await firestore.collection('post').doc(postId).delete();

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Expose Express app as a single Cloud Function:
exports.api = functions.https.onRequest(app);
