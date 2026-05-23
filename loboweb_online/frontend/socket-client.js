// Socket.io client for WebSocket communication with backend
// Replaces telegram.js for real-time game synchronization

let socket = null;
let currentGameId = null;
let currentPlayerName = null;
let isConnected = false;

// Initialize socket connection
function initializeSocket(gameId, playerName) {
  currentGameId = gameId;
  currentPlayerName = playerName;

  // Determine server URL based on environment
  const serverUrl = window.location.origin;

  socket = io(serverUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Connected to server');
    isConnected = true;
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
    isConnected = false;
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  // Game state updates
  socket.on('state_update', ({ game }) => {
    console.log('📊 State update received');
    // Update localStorage with new game state
    localStorage['tablonPartida'] = JSON.stringify(game);

    // Trigger update handlers
    if (window.onGameStateUpdate) {
      window.onGameStateUpdate(game);
    }
  });

  socket.on('game_started', ({ game }) => {
    console.log('🎮 Game started');
    localStorage['tablonPartida'] = JSON.stringify(game);

    if (window.onGameStarted) {
      window.onGameStarted(game);
    }
  });

  socket.on('error', ({ message }) => {
    console.error('Server error:', message);
    alert('Error: ' + message);
  });
}

// Create a new game
async function createGameOnline(hostName, rolesConfig) {
  return new Promise((resolve, reject) => {
    socket.emit('create_game', { hostName, rolesConfig }, (response) => {
      if (response.success) {
        currentGameId = response.gameId;
        currentPlayerName = hostName;
        localStorage['tablonPartida'] = JSON.stringify(response.game);
        console.log(`✅ Game created: ${response.gameId}`);
        resolve(response);
      } else {
        reject(new Error(response.error || 'Failed to create game'));
      }
    });
  });
}

// Join an existing game
async function joinGameOnline(gameId, playerName) {
  return new Promise((resolve, reject) => {
    socket.emit('join_game', { gameId, playerName }, (response) => {
      if (response.success) {
        currentGameId = gameId;
        currentPlayerName = playerName;
        localStorage['tablonPartida'] = JSON.stringify(response.game);
        console.log(`✅ Joined game: ${gameId}`);
        resolve(response);
      } else {
        reject(new Error(response.error || 'Failed to join game'));
      }
    });
  });
}

// Start game (host only)
async function startGameOnline() {
  return new Promise((resolve, reject) => {
    socket.emit('start_game', { gameId: currentGameId }, (response) => {
      if (response.success) {
        console.log('✅ Game started');
        resolve(response);
      } else {
        reject(new Error(response.error || 'Failed to start game'));
      }
    });
  });
}

// Send player action during night phase
async function sendActionOnline(action, target) {
  return new Promise((resolve, reject) => {
    socket.emit('action', {
      gameId: currentGameId,
      playerName: currentPlayerName,
      action,
      target
    }, (response) => {
      if (response.success) {
        console.log('✅ Action sent:', action);
        resolve(response);
      } else {
        reject(new Error(response.error || 'Failed to send action'));
      }
    });
  });
}

// Send vote
async function sendVoteOnline(votedFor) {
  return new Promise((resolve, reject) => {
    socket.emit('vote', {
      gameId: currentGameId,
      playerName: currentPlayerName,
      votedFor
    }, (response) => {
      if (response.success) {
        console.log('✅ Vote sent for:', votedFor);
        resolve(response);
      } else {
        reject(new Error(response.error || 'Failed to send vote'));
      }
    });
  });
}

// Get current game state
async function getGameState() {
  return new Promise((resolve, reject) => {
    socket.emit('get_state', { gameId: currentGameId }, (response) => {
      if (response.success) {
        resolve(response.game);
      } else {
        reject(new Error(response.error || 'Failed to get state'));
      }
    });
  });
}

// Poll for state updates (fallback if WebSocket fails)
async function pollGameState() {
  if (socket.connected) {
    return getGameState();
  }
  return JSON.parse(localStorage['tablonPartida'] || '{}');
}

// Register state update handler
function onStateUpdate(callback) {
  window.onGameStateUpdate = callback;
}

// Register game started handler
function onGameStarted(callback) {
  window.onGameStarted = callback;
}

// Get server stats
async function getServerStats() {
  return new Promise((resolve, reject) => {
    socket.emit('get_stats', (stats) => {
      resolve(stats);
    });
  });
}

// Export functions for use in HTML files
window.socketClient = {
  initializeSocket,
  createGameOnline,
  joinGameOnline,
  startGameOnline,
  sendActionOnline,
  sendVoteOnline,
  getGameState,
  pollGameState,
  onStateUpdate,
  onGameStarted,
  getServerStats,
  isConnected: () => isConnected,
  getCurrentGameId: () => currentGameId,
  getCurrentPlayerName: () => currentPlayerName
};
