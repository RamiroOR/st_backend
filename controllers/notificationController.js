const Notification = require('../models/Notification');
const io = require('../server'); // Importar io desde server.js

const createNotification = async (user, type, message) => {
  const notification = new Notification({
    user,
    type,
    message,
  });

  await notification.save();
  
  // Emitir notificación al usuario específico
  io.to(user.toString()).emit('notification', notification);
};

module.exports = { createNotification };
