import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'semantic-ui-react';
import GameContext from './GameContext';
import { playerOptions } from './utils';

const ExecutionPower = ({ player }) => {
  const { game, setGame } = useContext(GameContext);
  const [choice, setChoice] = useState();

  const {
    previous_president_id,
    players,
    power_target_id,
    room_code: roomCode,
  } = game || {};

  const executePlayer = () => {
    const formData = { player_id: choice };
    fetch(`/api/v1/games/${roomCode}/powers/execute`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => setGame(data));
  };

  const deadPlayer = players.find(({ id }) => id === power_target_id);
  const previousPresident = players.find(({ id }) => id === previous_president_id);
  const isPreviousPresident = previousPresident.id === player?.id;

  if (isPreviousPresident && !power_target_id) {
    const options = playerOptions(game).filter(({ value }) => value !== player?.id);
    return (
      <div className="presidential-powers">
        <div>
          Choose a player to kill:
        </div>
        <div className="grid-equal-columns">
          <Dropdown
            selection
            clearable
            onChange={(e, { value }) => setChoice(value)}
            options={options}
            placeholder="Select Player"
            value={choice}
          />
          <Button color="red" onClick={executePlayer}>
            Execute
          </Button>
        </div>
      </div>
    );
  }
  if (!power_target_id) {
    return (
      <div>
        {`${previousPresident.name} is choosing a player to execute. Tell them why they shouldn't kill you!`}
      </div>
    );
  }
  const isHitlerDeadString = deadPlayer.role === 'Hitler'
    ? 'Hitler is dead. Liberals win!'
    : 'They are NOT Hitler. The game continues.';

  return (
    <div className="bold-red emphasis-center">
      {`${previousPresident.name} has murdered ${deadPlayer.name}. ${isHitlerDeadString}`}
    </div>
  );
};

ExecutionPower.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
ExecutionPower.defaultProps = { player: undefined };
export default ExecutionPower;
