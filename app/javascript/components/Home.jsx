import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';
import useLocalStorage from './hooks/useLocalStorage';

const Home = () => {
  const [game, setGame] = useState();
  const [name, setName] = useState();
  const [roomCode, setRoomCode] = useState();
  const [error, setError] = useState();
  const history = useHistory();
  const [, setPlayerCookie] = useLocalStorage('remote-secret-hitler');

  const handleCreateClick = () => {
    const formData = { name };
    fetch('/api/v1/games', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then((data) => {
        if (data.player) {
          setPlayerCookie({ [data.game.room_code]: data.player });
        }
        setGame(data.game);
      });
  };

  useEffect(() => {
    if (game) {
      history.push(`/play/${game.room_code}`);
    }
  }, [game]);

  const handleSubmit = () => {
    const formData = { name, room_code: roomCode };
    fetch('/api/v1/games/join', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPlayerCookie({ [roomCode]: data.player });
          history.push(`/play/${roomCode}`);
        }
      });
  };

  return (
    <div className="home">
      <h3 className="hitler-header">
        Remote Secret Hitler Helper
      </h3>
      <div className="home-enter-name">
        <div>Enter your name: </div>
        <Input
          type="text"
          placeholder="Name"
          size="small"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="join-game">
        <div>Join an existing game: </div>
        <Input
          type="text"
          placeholder="Enter 5 digit room code"
          size="small"
          onChange={(e) => setRoomCode(e.target.value)}
          action={{
            onClick: handleSubmit,
            content: 'Join',
            color: 'green',
            disabled: !name && !roomCode,
          }}
        />
        {error && (
          <div className="join-error">
            {error}
          </div>
        )}
      </div>
      <div className="or">
        OR
      </div>
      <Button primary onClick={handleCreateClick} disabled={!name}>
        Create a new game
      </Button>
    </div>
  );
};

export default Home;
