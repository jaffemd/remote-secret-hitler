import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon } from 'semantic-ui-react';

const Role = ({ player, players }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  const otherFascists = players.filter(p => (p.party === 'Fascist' && p.id !== player.id));
  const otherFascistsString = otherFascists.map(f => (
    f.role === 'Hitler' ? `${f.name} (Hitler)` : f.name
  )).join(', ');
  const showFascists = player?.party === 'Fascist'
    && (player?.role !== 'Hitler' || players.length < 7);

  return player?.party && (
    <Accordion fluid styled>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        View Your Secret Role
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <div>
          {`Party Affiliation: ${player.party}`}
        </div>
        <div>
          {`Role: ${player.role}`}
        </div>
        {showFascists && (
          <div>
            {`Other Fascists: ${otherFascistsString}`}
          </div>
        )}
      </Accordion.Content>
    </Accordion>
  );
};

Role.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    host: PropTypes.bool,
    role: PropTypes.string,
    party: PropTypes.string,
  }).isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Role;
