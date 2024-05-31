// routes/questionRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Question = require('../models/Question');

const router = express.Router();

// Crear una nueva pregunta
router.post(
  '/',
  [auth, [check('title', 'Title is required').not().isEmpty(), check('content', 'Content is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newQuestion = new Question({
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
      });

      const question = await newQuestion.save();
      res.json(question);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Obtener todas las preguntas
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ date: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
