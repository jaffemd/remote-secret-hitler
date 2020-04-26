import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'semantic-ui-react';
import GameContext from './GameContext';
import { playerOptions } from './utils';

const InvestigatePower = ({ player }) => {
  const { game, setGame } = useContext(GameContext);
  const [choice, setChoice] = useState();

  const {
    previous_president_id,
    players,
    power_target_id,
    room_code: roomCode,
  } = game || {};

  const viewPartyMembership = () => {
    const formData = { player_id: choice };
    fetch(`/api/v1/games/${roomCode}/powers/view_party`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => setGame(data));
  };

  const investigatedPlayer = players.find(({ id }) => id === power_target_id);
  const previousPresident = players.find(({ id }) => id === previous_president_id);
  const isPreviousPresident = previousPresident.id === player?.id;

  if (isPreviousPresident) {
    if (!power_target_id) {
      const options = playerOptions(game).filter(({ value }) => value !== player?.id);
      return (
        <div className="presidential-powers">
          <div>
            Choose a player whose Party Membership you want to view:
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
            <Button primary onClick={viewPartyMembership}>
              View Party Membership
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="emphasis-center">
        {`${investigatedPlayer.name} is a member of the ${investigatedPlayer.party} party`}
      </div>
    );
  }
  if (!power_target_id) {
    return (
      <div>
        {`${previousPresident.name} is choosing whose party membership they want to view`}
      </div>
    );
  }
  return (
    <div className="emphasis-center">
      {`${previousPresident.name} has chosen to investigate the party membership of ${investigatedPlayer.name}`}
    </div>
  );
};

InvestigatePower.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
InvestigatePower.defaultProps = { player: undefined };
export default InvestigatePower;
