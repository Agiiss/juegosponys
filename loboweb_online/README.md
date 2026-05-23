# Loboweb Online - Multiplayer Werewolf Game

A robust, online multiplayer version of the classic Werewolf deduction game. Play with friends in real-time using WebSocket technology. **Completely free** with support for up to 5 concurrent games.

## Features

✅ **Real-time Multiplayer** - Instant synchronization via WebSocket  
✅ **5 Concurrent Games** - Play multiple games simultaneously  
✅ **9 Unique Roles** - Doble, Lobo, Aprendiz, Ladrón, Alborotadora, Borracho, Insomnia, Aldeano, Curtidor  
✅ **Free Hosting** - Use Railway, Render, or Replit (free tiers)  
✅ **No Telegram Required** - Direct game codes for player joining  
✅ **Game Persistence** - Firebase Firestore saves game history  
✅ **Audio/Video Assets** - Full narration and sound effects  

## Tech Stack

**Backend:**
- Node.js + Express
- Socket.io (WebSocket)
- Firebase Firestore (optional)

**Frontend:**
- HTML5 + CSS3 + JavaScript
- Socket.io client

**Hosting:**
- Railway.app (recommended)
- Render.com
- Replit

## Quick Start

### 1. Install Dependencies

```bash
cd loboweb_online/backend
npm install
```

### 2. Configure Environment (Optional - Firebase)

Create a `.env` file in `backend/`:

```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=xxx
...
PORT=3000
NODE_ENV=development
```

Skip Firebase if you just want to test locally (games will be in-memory only).

### 3. Run Locally

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Open in Browser

Visit `http://localhost:3000` and:
- **Create Game** - Host creates a game and gets a code (e.g., `ABC123`)
- **Join Game** - Other players enter the game code
- **Start Game** - Host clicks "Iniciar" when all players joined
- **Play** - Follow the night phase, vote, and determine winners

## Game Flow

1. **Lobby** → Host creates game, players join with code
2. **Role Configuration** → Host selects which roles are in the game
3. **Waiting Room** → Players wait until host starts
4. **Night Phase** → Roles take turns with special abilities
5. **Voting** → All players vote to eliminate someone
6. **Results** → Determine winners (Aldeanos, Lobos, or Curtidor)

## Deployment to Railway

1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select `loboweb_online` directory
4. Set environment variables (Firebase credentials)
5. Deploy!

Your game will be live at: `https://your-app.railway.app`

## Project Structure

```
loboweb_online/
├── backend/
│   ├── server.js              # Express + Socket.io server
│   ├── game-manager.js        # Game lifecycle (max 5 limit)
│   ├── game-state.js          # In-memory game storage
│   ├── socket-handlers.js     # WebSocket event handlers
│   ├── firebase-config.js     # Firestore integration
│   └── package.json
├── frontend/
│   ├── index.html             # Lobby/join screen
│   ├── crear-partida.html     # Role configuration
│   ├── espera-jugadores.html  # Waiting room
│   ├── juego.html             # Game play
│   ├── partida.js             # Game logic (unchanged from loboweb)
│   ├── socket-client.js       # WebSocket client
│   └── recursos/              # Audio/images/video
└── README.md
```

## API Endpoints

### HTTP
- `GET /api/health` - Server status
- `GET /api/stats` - Active games statistics
- `GET /api/games` - List of active games (debug)

### WebSocket Events

**Client → Server:**
- `create_game` - Create new game
- `join_game` - Join existing game
- `start_game` - Start night phase (host only)
- `action` - Send player action
- `vote` - Vote for elimination
- `get_state` - Request current state
- `get_stats` - Get server stats

**Server → Client:**
- `state_update` - Game state changed
- `game_started` - Night phase started
- `error` - Error message

## Limits

- **Max 5 concurrent games** (enforced by server)
- **Max 8 players per game** (from original rules)
- **Inactive game timeout**: 1 hour (auto-cleanup)
- **Free tier**: ~600 concurrent users (Firebase), ~300 (Railway)

## Game Rules

### Night Phase
- **Doble** (0) - Peek at any card
- **Lobo** (1) - Peek and swap any card
- **Aprendiz** (2) - Peek at own center card
- **Ladrón** (3) - Swap any two cards
- **Alborotadora** (4) - Flip all roles face-up
- **Borracho** (5) - Swap with random center card
- **Insomnia** (6) - See final role after night
- **Aldeano** / **Curtidor** - No night action

### Win Conditions
1. Any Curtidor alive → **Curtidores win**
2. No Lobo alive → **Aldeanos win**
3. Any Lobo eliminated by vote → **Aldeanos win**
4. Otherwise → **Lobos win**

## Troubleshooting

**"Maximum 5 concurrent games" error**
- Wait for other games to end, or restart server

**Players not syncing**
- Check WebSocket connection in browser DevTools
- Ensure firewall doesn't block port 3000

**Firebase not saving**
- Firebase is optional, games work in-memory
- Check `.env` file has correct credentials

## Future Enhancements

- [ ] Game lobbies/chat
- [ ] Player ratings/leaderboard
- [ ] Spectator mode
- [ ] Mobile app
- [ ] Discord integration
- [ ] Game replay system

## License

MIT - Feel free to modify and share

## Support

For issues or suggestions, open an issue on GitHub or contact the team.

---

**Ready to play?** [Deploy to Railway](https://railway.app) or run `npm run dev` locally! 🎮
