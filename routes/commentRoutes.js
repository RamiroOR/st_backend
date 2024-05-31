const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// Crear un nuevo comentario en un post
router.post(
  '/:postId',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const user = await User.findById(req.user.id).select('-password');

      const newComment = new Comment({
        text,
        user: req.user.id,
        post: req.params.postId,
      });

      const comment = await newComment.save();

      // Populate user field before sending the response
      const populatedComment = await comment.populate('user', ['name']).execPopulate();

      res.json(populatedComment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Obtener todos los comentarios de un post
router.get('/:postId', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({ date: -1 }).populate('user', ['name']);
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
