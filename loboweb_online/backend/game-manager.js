const { v4: uuidv4 } = require('uuid');
const gameState = require('./game-state');

const MAX_CONCURRENT_GAMES = 5;

// Create a new game with host name and role configuration
function createGame(hostName, rolesConfig) {
  // Check if we can create a new game
  if (getActiveGameCount() >= MAX_CONCURRENT_GAMES) {
    throw new Error(`Maximum ${MAX_CONCURRENT_GAMES} concurrent games reached. Please try again later.`);
  }

  const gameId = generateGameCode();

  // Initialize game state
  const initialState = {
    gameId: gameId,
    jugadores: [hostName],
    roles_jugables: { ...rolesConfig },
    roles_iniciales: {},
    cartas_centro: [],
    roles_finales: {},
    turno_actual: '',
    fase_actual: 'esperando',
    votacion: {},
    inicio: 0,
    inicio_ts: 0,
    paso_idx: -1,
    tipos_roles: Object.keys(rolesConfig).filter(role => rolesConfig[role] > 0),
    acciones_completadas: {},
    doble_rol_copiado: null,
    createdAt: new Date().getTime(),
    lastActivity: new Date().getTime()
  };

  // Store game in memory
  gameState.setGame(gameId, initialState);

  console.log(`✅ Game created: ${gameId} by ${hostName}`);
  return gameId;
}

// Get existing game
function getGame(gameId) {
  return gameState.getGame(gameId);
}

// Update game state
function updateGame(gameId, newState) {
  const game = gameState.getGame(gameId);
  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }

  newState.lastActivity = new Date().getTime();
  gameState.setGame(gameId, newState);

  // TODO: Save to Firebase
  return newState;
}

// Delete game (cleanup)
function deleteGame(gameId) {
  gameState.deleteGame(gameId);
  console.log(`🗑️  Game deleted: ${gameId}`);
}

// Get count of active games
function getActiveGameCount() {
  return gameState.getGameIds().length;
}

// Get list of all active games
function getActiveGames() {
  return gameState.getAllGames();
}

// Generate unique game code (6 alphanumeric characters)
function generateGameCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Ensure uniqueness
  while (gameState.getGame(code)) {
    code = generateGameCode();
  }

  return code;
}

// Cleanup old games (inactive for >1 hour)
function cleanupOldGames() {
  const now = new Date().getTime();
  const oneHourMs = 60 * 60 * 1000;

  const games = gameState.getAllGames();
  for (const gameId in games) {
    const game = games[gameId];
    if (now - game.lastActivity > oneHourMs) {
      deleteGame(gameId);
      console.log(`🧹 Cleaned up inactive game: ${gameId}`);
    }
  }
}

// Get game stats
function getGameStats() {
  const games = gameState.getAllGames();
  const stats = {
    totalGames: gameState.getGameIds().length,
    maxGames: MAX_CONCURRENT_GAMES,
    slotsAvailable: MAX_CONCURRENT_GAMES - gameState.getGameIds().length,
    totalPlayers: 0,
    gamesInProgress: 0
  };

  for (const gameId in games) {
    const game = games[gameId];
    stats.totalPlayers += game.jugadores.length;
    if (game.inicio === 1) {
      stats.gamesInProgress++;
    }
  }

  return stats;
}

module.exports = {
  createGame,
  getGame,
  updateGame,
  deleteGame,
  getActiveGameCount,
  getActiveGames,
  generateGameCode,
  cleanupOldGames,
  getGameStats
};
