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
app.post('/posts', async (req, res) => {
  try {
    const { description } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const newPost = await firestore.collection('posts').add({
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
app.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const postSnapshot = await firestore.collection('posts').doc(postId).get();

    if (!postSnapshot.exists) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postData = postSnapshot.data();
    return res.status(200).json({ id: postSnapshot.id, ...postData });
  } catch (error) {
    console.error('Error reading post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all posts
app.get('/posts', async (req, res) => {
  try {
    const postsSnapshot = await firestore.collection('posts').get();

    const allPosts = [];
    postsSnapshot.forEach((doc) => {
      const postData = doc.data();
      allPosts.push({ id: doc.id, ...postData });
    });

    return res.status(200).json(allPosts);
  } catch (error) {
    console.error('Error reading all posts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a post
app.put('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { description } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    await firestore.collection('posts').doc(postId).update({
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
app.delete('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    await firestore.collection('posts').doc(postId).delete();

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Expose Express app as a single Cloud Function:
exports.api = functions.https.onRequest(app);
