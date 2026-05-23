const gameManager = require('./game-manager');
const gameState = require('./game-state');

// Handle all socket.io connections and events
function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`👤 New connection: ${socket.id}`);

    // Player creates a new game
    socket.on('create_game', ({ hostName, rolesConfig }, callback) => {
      try {
        console.log(`📝 Creating game with host: ${hostName}`);
        const gameId = gameManager.createGame(hostName, rolesConfig);

        // Add host to game
        const game = gameManager.getGame(gameId);
        socket.join(gameId); // Join Socket.io room
        socket.gameId = gameId;
        socket.playerName = hostName;

        callback({ success: true, gameId, game });
        broadcastGameState(io, gameId);
      } catch (error) {
        console.error('Error creating game:', error.message);
        callback({ success: false, error: error.message });
      }
    });

    // Player joins an existing game
    socket.on('join_game', ({ gameId, playerName }, callback) => {
      try {
        console.log(`🎮 ${playerName} joining game ${gameId}`);
        const game = gameManager.getGame(gameId);

        if (!game) {
          return callback({ success: false, error: 'Game not found' });
        }

        if (game.inicio !== 0) {
          return callback({ success: false, error: 'Game already started' });
        }

        if (game.jugadores.includes(playerName)) {
          return callback({ success: false, error: 'Name already taken' });
        }

        // Add player to game
        game.jugadores.push(playerName);
        gameManager.updateGame(gameId, game);

        socket.join(gameId);
        socket.gameId = gameId;
        socket.playerName = playerName;

        callback({ success: true, game });
        broadcastGameState(io, gameId);
      } catch (error) {
        console.error('Error joining game:', error.message);
        callback({ success: false, error: error.message });
      }
    });

    // Host starts the game
    socket.on('start_game', ({ gameId }, callback) => {
      try {
        const game = gameManager.getGame(gameId);

        if (!game) {
          return callback({ success: false, error: 'Game not found' });
        }

        // Validate host is starting
        if (game.jugadores[0] !== socket.playerName) {
          return callback({ success: false, error: 'Only host can start game' });
        }

        // Mark game as started
        game.inicio = 1;
        game.inicio_ts = Date.now() + 7000; // 7 second delay for sync
        game.fase_actual = 'turnos';

        gameManager.updateGame(gameId, game);

        callback({ success: true, game });
        io.to(gameId).emit('game_started', { game });
      } catch (error) {
        console.error('Error starting game:', error.message);
        callback({ success: false, error: error.message });
      }
    });

    // Handle role actions during night phase
    socket.on('action', ({ gameId, playerName, action, target }, callback) => {
      try {
        const game = gameManager.getGame(gameId);

        if (!game) {
          return callback({ success: false, error: 'Game not found' });
        }

        // Validate player and action will be handled in game logic
        // For now, just update the state
        gameManager.updateGame(gameId, game);

        callback({ success: true });
        broadcastGameState(io, gameId);
      } catch (error) {
        console.error('Error processing action:', error.message);
        callback({ success: false, error: error.message });
      }
    });

    // Handle voting
    socket.on('vote', ({ gameId, playerName, votedFor }, callback) => {
      try {
        const game = gameManager.getGame(gameId);

        if (!game) {
          return callback({ success: false, error: 'Game not found' });
        }

        game.votacion[playerName] = votedFor;
        gameManager.updateGame(gameId, game);

        callback({ success: true });
        broadcastGameState(io, gameId);
      } catch (error) {
        console.error('Error processing vote:', error.message);
        callback({ success: false, error: error.message });
      }
    });

    // Get current game state
    socket.on('get_state', ({ gameId }, callback) => {
      try {
        const game = gameManager.getGame(gameId);
        if (game) {
          callback({ success: true, game });
        } else {
          callback({ success: false, error: 'Game not found' });
        }
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Get server stats
    socket.on('get_stats', (callback) => {
      callback(gameManager.getGameStats());
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`👋 Disconnected: ${socket.id}`);

      // TODO: Remove player from game if not started
      // TODO: End game if host disconnects during game
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
}

// Broadcast game state to all players in a game
function broadcastGameState(io, gameId) {
  const game = gameManager.getGame(gameId);
  if (game) {
    io.to(gameId).emit('state_update', { game });
  }
}

module.exports = {
  setupSocketHandlers,
  broadcastGameState
};
