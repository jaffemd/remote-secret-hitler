import React, { useContext, useEffect, useState } from 'react';
import { Dropdown, Button, Segment } from 'semantic-ui-react';
import GameContext from './GameContext';
import { putGameUpdate, playerOptions } from './utils';

const ElectionSetup = () => {
  const { game, setGame } = useContext(GameContext);
  const savedPresident = game?.players?.find(p => p.president)?.id;
  const savedChancellor = game?.players?.find(p => p.chancellor)?.id;
  const [president, setPresident] = useState(savedPresident);
  const [chancellor, setChancellor] = useState(savedChancellor);

  useEffect(() => {
    setPresident(savedPresident);
  }, [savedPresident]);
  useEffect(() => {
    setChancellor(savedChancellor);
  }, [savedChancellor]);

  const {
    power_in_progress,
    room_code: roomCode,
    vote_result,
    election_tracker,
  } = game;

  const chancellorOptions = playerOptions(game).filter(p => p.value !== president);
  const presidentOptions = playerOptions(game).filter(p => p.value !== chancellor);

  const openVoting = putGameUpdate({ action: 'open_voting', setGame, roomCode });
  const newElection = putGameUpdate({ action: 'new_election', setGame, roomCode });
  const enactTopPolicy = putGameUpdate({ action: 'enact_top_policy', setGame, roomCode });

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

  if (power_in_progress) {
    return null;
  }

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
            <Button
              color={vote_result === 'pass' ? 'green' : undefined}
              onClick={startLegislativeSession}
            >
              Start Legislative Session
            </Button>
            <Button
              color={vote_result === 'fail' ? 'green' : undefined}
              onClick={newElection}
            >
              Clear and start another election
            </Button>
            <Button
              color={election_tracker >= 3 ? 'red' : undefined}
              onClick={enactTopPolicy}
            >
              Reveal and enact policy on top of deck
            </Button>
          </>
        )}
      </div>
    </Segment>
  );
};

export default ElectionSetup;
