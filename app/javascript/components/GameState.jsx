import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon } from 'semantic-ui-react';

const GameState = ({ game }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const {
    liberal_policies = 0,
    fascist_policies = 0,
    deck = [],
    discard = [],
  } = game || {};

  return (
    <Accordion fluid styled>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        Game State
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <div className="game-state">
          <div className="policies-header">
            Policies Enacted
          </div>
          <div className="policies">
            <div className="bold-navy">
              Liberal
            </div>
            <div className="bold-red">
              Fascist
            </div>
            <div className="bold-navy">
              {liberal_policies}
            </div>
            <div className="bold-red">
              {fascist_policies}
            </div>
          </div>
          <div className="deck">
            <div>
              {`Deck: ${deck.length}`}
            </div>
            <div>
              {`Discard: ${discard.length}`}
            </div>
          </div>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

GameState.propTypes = {
  game: PropTypes.shape({
    deck: PropTypes.array,
    discard: PropTypes.array,
  }).isRequired,
};
export default GameState;
