import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Segment } from 'semantic-ui-react';
import { idSort } from './utils';

const putGameUpdate = ({ action, setGame, roomCode }) => () => {
  fetch(`/api/v1/games/${roomCode}/${action}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => setGame(data));
};

const ElectionSetup = ({ game, setGame }) => {
  const savedPresident = game?.players?.map(p => p.president)?.id;
  const savedChancellor = game?.players?.map(p => p.chancellor)?.id;
  const [president, setPresident] = useState(savedPresident);
  const [chancellor, setChancellor] = useState(savedChancellor);

  useEffect(() => {
    setPresident(savedPresident);
  }, [savedPresident]);
  useEffect(() => {
    setChancellor(savedChancellor);
  }, [savedChancellor]);

  const {
    room_code: roomCode,
    vote_result,
  } = game;

  const playerOptions = game.players.sort(idSort).map(p => ({
    key: p.id, text: p.name, value: p.id,
  }));

  const chancellorOptions = playerOptions.filter(p => p.value !== president);
  const presidentOptions = playerOptions.filter(p => p.value !== chancellor);

  const openVoting = putGameUpdate({ action: 'open_voting', setGame, roomCode });

  const newElection = putGameUpdate({ action: 'new_election', setGame, roomCode });

  const startLegislativeSession = putGameUpdate({
    action: 'legislative_session',
    setGame,
    roomCode,
  });

  const setGovernmentRole = ({ role, value }) => {
    const formData = { player_id: value };
    fetch(`/api/v1/games/${roomCode}/${role}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => setGame(data));
  };

  const handlePresidentChange = (e, { value }) => {
    setPresident(value);
    setGovernmentRole({ role: 'president', value });
  };
  const handleChancellorChange = (e, { value }) => {
    setChancellor(value);
    setGovernmentRole({ role: 'chancellor', value });
  };

  return (
    <Segment>
      <div className="election-setup">
        {!vote_result && (
          <>
            <Dropdown
              selection
              clearable
              onChange={handlePresidentChange}
              options={presidentOptions}
              placeholder="Select President"
              value={president}
            />
            <Dropdown
              selection
              clearable
              onChange={handleChancellorChange}
              options={chancellorOptions}
              placeholder="Select Chancellor"
              value={chancellor}
            />
            <Button
              color="green"
              onClick={openVoting}
              disabled={!president || !chancellor}
            >
              Start Election
            </Button>
          </>
        )}
        {vote_result && (
          <>
            <Button primary onClick={startLegislativeSession}>
              Start Legislative Session
            </Button>
            <Button color="red" onClick={newElection}>
              Clear and start another election
            </Button>
            <Button onClick={() => {}}>
              Reveal and enact policy on top of deck
            </Button>
          </>
        )}
      </div>
    </Segment>
  );
};

ElectionSetup.propTypes = {
  game: PropTypes.shape({
    vote_result: PropTypes.oneOf(['pass', 'fail']),
    room_code: PropTypes.string,
    players: PropTypes.array,
  }).isRequired,
  setGame: PropTypes.func.isRequired,
};
export default ElectionSetup;
