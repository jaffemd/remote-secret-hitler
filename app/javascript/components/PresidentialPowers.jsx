import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import GameContext from './GameContext';
import { powersMap } from './utils';
import InvestigatePower from './InvestigatePower';
import ExecutionPower from './ExecutionPower';
import PolicyPeek from './PolicyPeek';

const PresidentialPowers = ({ player }) => {
  const { game } = useContext(GameContext);

  const {
    active_presidential_power,
    previous_president_id,
    players,
  } = game || {};

  if (!active_presidential_power) {
    return null;
  }

  const previousPresident = players.find(({ id }) => id === previous_president_id);

  const specialElection = () => (
    <div>
      <span className="emphasis">
        {`${previousPresident.name} gets to choose the next president.`}
      </span>
      {'They may not choose themselves, but are allowed to pick the previous Chancellor. After the election, the presidential rotation picks up where it left off.'}
    </div>
  );

  return (
    <Segment>
      <div className="presidential-powers">
        <div className="policies-header">
          {`Presidential Power: ${powersMap[active_presidential_power]}`}
        </div>
        {active_presidential_power === 'INVESTIGATE' && <InvestigatePower player={player} />}
        {active_presidential_power === 'SPECIAL_ELECTION' && specialElection()}
        {active_presidential_power === 'EXECUTION' && <ExecutionPower player={player} />}
        {active_presidential_power === 'PEEK' && <PolicyPeek player={player} />}
      </div>
    </Segment>
  );
};

PresidentialPowers.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
PresidentialPowers.defaultProps = { player: undefined };
export default PresidentialPowers;
