import React, { useContext } from 'react';
import { Segment } from 'semantic-ui-react';
import GameContext from './GameContext';
import LiberalCard from './LiberalCard';
import FascistCard from './FascistCard';

const PreviousGovernment = () => {
  const { game } = useContext(GameContext);
  const {
    chaos_ensued,
    players,
    policy_played,
    previous_chancellor_id,
    previous_president_id,
  } = game || {};

  if (!policy_played) {
    return null;
  }

  const previousPresident = players.find(({ id }) => id === previous_president_id)?.name;
  const previousChancellor = players.find(({ id }) => id === previous_chancellor_id)?.name;

  return (
    <Segment>
      <div className="previous-government">
        <div>
          <div className="emphasis">
            Legislative Session Result
          </div>
          {!chaos_ensued && (
            <>
              <div>
                {`President: ${previousPresident}`}
              </div>
              <div>
                {`Chancellor: ${previousChancellor}`}
              </div>
            </>
          )}
          {chaos_ensued && (
            <div>
              {'Three governments in a row were rejected. The country was thrown into chaos and the top policy in the deck was enacted. Any presidential power that may have been granted by this policy is ignored. The election tracker and term limits are reset.'}
            </div>
          )}
        </div>
        {policy_played === 'Liberal' ? <LiberalCard /> : <FascistCard />}
      </div>
    </Segment>
  );
};

export default PreviousGovernment;
