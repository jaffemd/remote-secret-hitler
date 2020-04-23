import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment } from 'semantic-ui-react';

const liberal = (handleClick, selected) => (
  <Button
    basic
    className={`card-button liberal ${selected ? 'selected' : ''}`}
    onClick={handleClick}
  >
    <div className="policy-card liberal">
      <span aria-label="dove" role="img" className="emoji">
        &#x1f54a;
      </span>
      <span className="policy-label">
        Liberal
      </span>
    </div>
  </Button>
);

const fascist = (handleClick, selected) => (
  <Button
    basic
    className={`card-button fascist ${selected ? 'selected' : ''}`}
    onClick={handleClick}
  >
    <div className="policy-card fascist">
      <span aria-label="skull" role="img" className="emoji">
        &#x1F480;
      </span>
      <span className="policy-label">
        Fascist
      </span>
    </div>
  </Button>
);

const Policies = ({ game, setGame }) => {
  const [selected, setSelected] = useState();
  const {
    room_code: roomCode,
    draw,
  } = game || {};

  const handleClick = index => () => setSelected(index);
  const isSelected = index => index === selected;

  const onSubmit = () => {
    const formData = { card_index: selected };
    fetch(`/api/v1/games/${roomCode}/choose_card`, {
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
    <Segment>
      <div className="policy-container">
        <div className="policy-header">
          {draw.length === 3 ? 'Choose 1 policy to DISCARD' : 'Choose 1 policy to ENACT'}
        </div>
        <div className="policy-draw">
          {draw.map((policy, index) => (
            (policy === 'Liberal')
              ? liberal(handleClick(index), isSelected(index))
              : fascist(handleClick(index), isSelected(index))
          ))}
        </div>
        <Button color="green" onClick={onSubmit} disabled={selected === undefined}>
          {draw.length === 3 ? 'Discard Selected Policy' : 'Enact Selected Policy'}
        </Button>
      </div>

    </Segment>
  );
};

Policies.propTypes = {
  game: PropTypes.shape({
    draw: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setGame: PropTypes.func.isRequired,
};
export default Policies;
