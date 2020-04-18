import React, { useEffect, useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { useParams } from "react-router-dom";
import useInterval from './hooks/useInterval';
import useLocalStorage from './hooks/useLocalStorage';
import Players from './Players';

const Game = () => {
  const { id: roomCode } = useParams();
  const [name, setName] = useState('');
  const [game, setGame] = useState();

  const [playerCookie, setPlayerCookie] = useLocalStorage(roomCode, { [roomCode]: null });
  console.log('playerCookie', playerCookie);
  const player = playerCookie[roomCode];


  const fetchGame = () => {
    if (roomCode) {
      fetch(`/api/v1/games/${roomCode}`)
        .then(response => response.json())
        .then(data => setGame(data));
    }
  }

  useEffect(() => {
    if (roomCode) {
      fetchGame();
    }
  }, [roomCode]);

  useInterval(fetchGame, 5000);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    const data = { name, room_code: roomCode };
    fetch('/api/v1/players', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        setPlayerCookie({ [roomCode]: data });
        fetchGame();
      });
  };

  return (
    <div className="game">
      {!player && (
        <div className="enter-name">
          <div>Enter your name: </div>
          <Input
            type="text"
            placeholder="Name"
            size="small"
            onChange={handleChange}
            action={{
              onClick: handleSubmit,
              content: 'Submit',
              primary: true,
            }}
          />
        </div>
      )}
      <div className="players-table">
        <Players game={game} player={player} />
      </div>
    </div>
  );
};

export default Game;
