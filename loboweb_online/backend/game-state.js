// In-memory game state store
// This is the single source of truth for all active games
const games = {};

// Get a specific game by ID
function getGame(gameId) {
  return games[gameId] || null;
}

// Set/update a game
function setGame(gameId, gameState) {
  games[gameId] = gameState;
}

// Delete a game
function deleteGame(gameId) {
  delete games[gameId];
}

// Get all game IDs
function getGameIds() {
  return Object.keys(games);
}

// Get all games
function getAllGames() {
  return { ...games };
}

// Check if game exists
function gameExists(gameId) {
  return gameId in games;
}

// Clear all games (for testing/reset)
function clearAllGames() {
  for (const gameId of Object.keys(games)) {
    delete games[gameId];
  }
}

module.exports = {
  getGame,
  setGame,
  deleteGame,
  getGameIds,
  getAllGames,
  gameExists,
  clearAllGames
};
