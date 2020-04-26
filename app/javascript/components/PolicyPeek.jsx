import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from './GameContext';
import LiberalCard from './LiberalCard';
import FascistCard from './FascistCard';

const PolicyPeek = ({ player }) => {
  const { game } = useContext(GameContext);

  const {
    deck,
    previous_president_id,
    players,
  } = game || {};

  const previousPresident = players.find(({ id }) => id === previous_president_id);
  const isPreviousPresident = previousPresident.id === player?.id;

  const key = (type, index) => `${type}-${index}`;

  if (isPreviousPresident) {
    return (
      <div className="presidential-powers">
        <div>
          {'These are the next three cards in the policy deck:'}
        </div>
        <div className="policy-draw">
          {deck.slice(0, 3).map((card, index) => (
            card === 'Liberal'
              ? <LiberalCard key={key('liberal', index)} />
              : <FascistCard key={key('fascist', index)} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="emphasis-center">
      {`${previousPresident.name} is peeking at the next 3 tiles in the policy deck`}
    </div>
  );
};

PolicyPeek.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
PolicyPeek.defaultProps = { player: undefined };
export default PolicyPeek;
