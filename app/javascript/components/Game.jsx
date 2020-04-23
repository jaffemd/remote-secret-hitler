import React, { useEffect, useState } from 'react';
import { Button, Input, Icon } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import useInterval from './hooks/useInterval';
import useLocalStorage from './hooks/useLocalStorage';
import Players from './Players';
import Role from './Role';
import Voting from './Voting';
import GameState from './GameState';
import ElectionSetup from './ElectionSetup';
import Policies from './Policies';

const Game = () => {
  const { id: roomCode } = useParams();
  const [name, setName] = useState('');
  const [game, setGame] = useState();

  const [playerCookie, setPlayerCookie] = useLocalStorage('remote-secret-hitler', { [roomCode]: null });
  const cachedPlayer = playerCookie[roomCode];
  const player = game && cachedPlayer && game.players.find(p => p.id === cachedPlayer.id);

  const host = player?.host;
  const players = game?.players || [];
  const numPlayers = players.length;

  const fetchGame = () => {
    if (roomCode) {
      fetch(`/api/v1/games/${roomCode}`)
        .then(response => response.json())
        .then(data => setGame(data));
    }
  };

  useEffect(() => {
    if (roomCode) {
      fetchGame();
    }
  }, [roomCode]);

  useInterval(fetchGame, 7000);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    const formData = { name, room_code: roomCode };
    fetch('/api/v1/players', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then((data) => {
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
  };

  const {
    voting,
    vote_result,
    in_progress: inProgress,
    legislative_session,
    draw,
  } = game || {};

  const showPolicyDraw = legislative_session && (
    (player?.president && draw?.length === 3)
    || (player?.chancellor && draw?.length === 2)
  );

  return (
    <div className="game">
      <h3 className="hitler-header">
        Remote Secret Hitler
      </h3>
      {player && inProgress && (
        <Role
          player={player}
          players={game?.players || []}
        />
      )}
      {showPolicyDraw && <Policies game={game} setGame={setGame} />}
      {inProgress && <GameState game={game} />}
      {player && !inProgress && (
        <Button icon labelPosition="right" onClick={invite}>
          Copy Invite Link
          <Icon name="copy" />
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
      {host && inProgress && !voting && !legislative_session && (
        <ElectionSetup game={game} setGame={setGame} />
      )}
      {voting && (
        <Voting setGame={setGame} playerId={player?.id} />
      )}
      {vote_result && (
        <div>
          {vote_result === 'pass' ? 'Vote Passed!' : 'Vote Failed'}
        </div>
      )}
      <div className="players-table">
        <Players game={game} player={player} />
      </div>
    </div>
  );
};

export default Game;
