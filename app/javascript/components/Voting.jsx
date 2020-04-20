import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const Voting = ({ playerId, setGame }) => {
  if (!playerId) {
    return null;
  }

  const handleClick = vote => () => {
    const formData = { vote };
    fetch(`/api/v1/players/${playerId}/vote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => setGame(data));
  };

  return (
    <div className="voting">
      <div className="bold">
        VOTE VOTE VOTE VOTE VOTE!!!!
      </div>
      <Button.Group>
        <Button primary onClick={handleClick('yes')}>Ja! (yes)</Button>
        <Button.Or />
        <Button color="red" onClick={handleClick('no')}>Nein! (no)</Button>
      </Button.Group>
    </div>
  );
};

Voting.propTypes = {
  playerId: PropTypes.number,
  setGame: PropTypes.func.isRequired,
};
Voting.defaultProps = { playerId: undefined };
export default Voting;
