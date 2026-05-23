const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const firebaseConfig = require('./firebase-config');
const socketHandlers = require('./socket-handlers');
const gameManager = require('./game-manager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Firebase
firebaseConfig.initializeFirebase();

// Setup Socket.io handlers
socketHandlers.setupSocketHandlers(io);

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get server statistics
app.get('/api/stats', (req, res) => {
  const stats = gameManager.getGameStats();
  res.json(stats);
});

// Get active games (for debugging)
app.get('/api/games', (req, res) => {
  const games = gameManager.getActiveGames();
  const sanitized = {};

  for (const gameId in games) {
    const game = games[gameId];
    sanitized[gameId] = {
      host: game.jugadores[0],
      players: game.jugadores.length,
      phase: game.fase_actual,
      started: game.inicio === 1
    };
  }

  res.json(sanitized);
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Cleanup old games every 5 minutes
setInterval(() => {
  gameManager.cleanupOldGames();
}, 5 * 60 * 1000);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🎮 Loboweb Online - Multiplayer Werewolf Game`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready for connections`);
  console.log(`🎯 Max concurrent games: 5`);
  console.log('═══════════════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
