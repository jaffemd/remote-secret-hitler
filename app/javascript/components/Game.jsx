import React, { useEffect, useState } from 'react';
import { Button, Input, Icon } from 'semantic-ui-react';
import { useParams } from "react-router-dom";
import copy from 'copy-to-clipboard';
import useInterval from './hooks/useInterval';
import useLocalStorage from './hooks/useLocalStorage';
import Players from './Players';
import Role from './Role';

const Game = () => {
  const { id: roomCode } = useParams();
  const [name, setName] = useState('');
  const [game, setGame] = useState();

  const [playerCookie, setPlayerCookie] = useLocalStorage('remote-secret-hitler', { [roomCode]: null });
  const cachedPlayer = playerCookie[roomCode];
  const player = game && cachedPlayer && game.players.find(p => p.id === cachedPlayer.id);

  const host = player?.host;
  const numPlayers = (game?.players || []).length;


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

  const invite = () => {
    copy(`Join my secret hitler game! Room Code: ${roomCode} ${window.location.href}`);
  };

  const startGame = () => {
    if (numPlayers >= 5 && numPlayers <= 10) {
      fetch(`/api/v1/games/${roomCode}/start`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => setGame(data));
    }
  }

  const inProgress = game?.in_progress;

  return (
    <div className="game">
      <h3 className="hitler-header">
        Remote Secret Hitler
      </h3>
      {player && <Role player={player} />}
      {player && !inProgress && (
        <Button icon labelPosition='right' onClick={invite}>
          Copy Invite Link
          <Icon name='copy' />
        </Button>
      )}
      {!player && !inProgress && (
        <div className="enter-name">
          <div>Join the action! Enter your name: </div>
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
      {player && !host && !inProgress && (
        <div>
          Waiting for host to start the game...
        </div>
      )}
      {host && !inProgress && (
        <Button primary disabled={numPlayers < 5} onClick={startGame}>
          Start Game
        </Button>
      )}
      <div className="players-table">
        <Players game={game} player={player} />
      </div>
    </div>
  );
};

export default Game;