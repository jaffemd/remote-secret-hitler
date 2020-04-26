import React, { useContext, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import GameContext from './GameContext';

const liberal = (handleClick, selected, index) => (
  <Button
    basic
    className={`card-button liberal ${selected ? 'selected' : ''}`}
    onClick={handleClick}
    key={`liberal-${index}`}
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

const fascist = (handleClick, selected, index) => (
  <Button
    basic
    className={`card-button fascist ${selected ? 'selected' : ''}`}
    onClick={handleClick}
    key={`liberal-${index}`}
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

const Policies = () => {
  const { game, setGame } = useContext(GameContext);
  const [selected, setSelected] = useState();

  const {
    room_code: roomCode,
    draw,
  } = game || {};
  const selectedPolicy = draw[selected];

  const handleClick = index => () => setSelected(index);
  const isSelected = index => index === selected;

  const onSubmit = () => {
    const formData = { selected: selectedPolicy };
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
        <div className="emphasis-center">
          {draw.length === 3 ? 'Choose 1 policy to DISCARD' : 'Choose 1 policy to ENACT'}
        </div>
        <div className="policy-draw">
          {draw.map((policy, index) => (
            (policy === 'Liberal')
              ? liberal(handleClick(index), isSelected(index), index)
              : fascist(handleClick(index), isSelected(index), index)
          ))}
        </div>
        <Button color="green" onClick={onSubmit} disabled={selected === undefined}>
          {draw.length === 3 ? 'Discard Selected Policy' : 'Enact Selected Policy'}
        </Button>
      </div>

    </Segment>
  );
};

export default Policies;
