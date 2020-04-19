import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon } from 'semantic-ui-react';

const Role = ({ player }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  return player?.party && (
    <div className="role-accordion">
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
        </Accordion.Content>
      </Accordion>
    </div>
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
};

export default Role;
