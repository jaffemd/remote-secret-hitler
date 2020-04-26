import React from 'react';

const GameContext = React.createContext({
  game: undefined,
  setGame: undefined,
  roomCode: undefined,
});
export default GameContext;
