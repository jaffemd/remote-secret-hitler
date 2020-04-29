import React, { useContext, useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import GameContext from './GameContext';
import { powersMap } from './utils';

const GameState = () => {
  const { game } = useContext(GameContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const {
    election_tracker = 0,
    liberal_policies = 0,
    next_presidential_power,
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
          {fascist_policies >= 3 && (
            <div className="emphasis-center">
              If Hitler is elected Chancellor, then the Fascists win.
            </div>
          )}
          <div className="policies">
            <div className="bold-navy">
              Liberal
            </div>
            <div className="bold-red">
              Fascist
            </div>
            <div className="bold-navy">
              {`${liberal_policies} (of 5)`}
            </div>
            <div className="bold-red">
              {`${fascist_policies} (of 6)`}
            </div>
          </div>
          <div className="grid-equal-columns">
            <div>
              {`Deck: ${deck.length}`}
            </div>
            <div>
              {`Discard: ${discard.length}`}
            </div>
          </div>
          <div className="game-state-powers">
            <div>
              {'Presidential power granted upon the next fascist policy being passed:'}
            </div>
            <div className="emphasis">
              {powersMap[next_presidential_power] || 'None'}
            </div>
          </div>
          <div className="text-center">
            {`Failed Election Tracker: ${election_tracker} (of 3)`}
          </div>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

export default GameState;
