import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'semantic-ui-react';
import GameContext from './GameContext';

const JoinGame = ({ fetchGame, setPlayerCookie }) => {
  const [name, setName] = useState('');
  const [joinError, setJoinError] = useState();
  const { game, roomCode } = useContext(GameContext);

  const handleChange = (e) => {
    setJoinError(undefined);
    setName(e.target.value);
  };

  const rejoin = () => {
    const existingPlayer = game.players.find(p => p.name === name);
    setJoinError(undefined);
    if (existingPlayer) {
      setPlayerCookie({ [roomCode]: existingPlayer });
    }
  };

  const joinGame = () => {
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
        if (data.error) {
          setJoinError(data.error);
        } else {
          setPlayerCookie({ [roomCode]: data });
          fetchGame();
        }
      });
  };

  const inProgress = game?.in_progress;

  const tooManyPlayers = game?.players >= 10;

  return (
    <div className="enter-name">
      {!inProgress && !tooManyPlayers && (
        <div>Join the action! Enter your name: </div>
      )}
      {inProgress && (
        <div>
          {'This game is already in progess. Got disconnected? Type your name in excactly and hit Join. Do not use this to cheat and view another player\'s hand. '}
        </div>
      )}
      {(inProgress || !tooManyPlayers) && (
        <Input
          type="text"
          placeholder="Name"
          size="small"
          onChange={handleChange}
          error={Boolean(joinError)}
          action={{
            onClick: inProgress ? rejoin : joinGame,
            content: 'Join',
            primary: true,
          }}
        />
      )}
      {joinError && (
        <>
          <div className="join-error">
            {"You can't use the same name as someone already in the game."}
          </div>
          <div className="log-back-in">
            <div>
              {'Did you get disconnected and are trying to log back in? Do not use this to cheat and view another player\'s hand.'}
            </div>
            <Button size="small" onClick={rejoin}>
              Rejoin
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

JoinGame.propTypes = {
  fetchGame: PropTypes.func.isRequired,
  setPlayerCookie: PropTypes.func.isRequired,
};
export default JoinGame;
