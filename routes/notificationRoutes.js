const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Crear una nueva notificación
router.post('/', auth, async (req, res) => {
  const { user, type, message } = req.body;

  try {
    const notification = new Notification({
      user,
      type,
      message,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Obtener notificaciones para un usuario
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Marcar notificación como leída
router.put('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
