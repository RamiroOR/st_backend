const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// Crear una nueva publicación
router.post(
  '/',
  [auth, [check('content', 'Content is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    try {
      const newPost = new Post({
        user: req.user.id,
        content,
      });

      let post = await newPost.save();
      post = await post.populate('user', 'name').execPopulate();

      res.json(post);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

// Obtener todas las publicaciones
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).populate('user', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
