import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import useInterval from './hooks/useInterval';
import useLocalStorage from './hooks/useLocalStorage';
import Players from './Players';
import Role from './Role';
import Voting from './Voting';
import GameState from './GameState';
import ElectionSetup from './ElectionSetup';
import Policies from './Policies';
import JoinGame from './JoinGame';
import PreviousGovernment from './PreviousGovernment';
import PresidentialPowers from './PresidentialPowers';
import GameContext from './GameContext';

const Game = () => {
  const { id: roomCode } = useParams();
  const [game, setGame] = useState();

  const [playerCookie, setPlayerCookie] = useLocalStorage('remote-secret-hitler', { [roomCode]: null });
  const cachedPlayer = playerCookie[roomCode];
  const player = game && cachedPlayer && game.players.find(p => p.id === cachedPlayer.id);

  const host = player?.host;
  const players = game?.players || [];
  const numPlayers = players.length;

  const fetchGame = () => {
    if (roomCode) {
      const last_updated = game?.last_updated;
      const queryParams = last_updated ? `?last_updated=${game?.last_updated}` : '';
      fetch(`/api/v1/games/${roomCode}${queryParams}`)
        .then(response => response.json())
        .then(data => {
          if (data?.id) {
            setGame(data);
          }
        });
    }
  };

  useEffect(() => {
    if (roomCode) {
      fetchGame();
    }
  }, [roomCode]);

  useInterval(fetchGame, 5000);

  const invite = () => {
    copy(`Join my secret hitler game! ${window.location.href}`);
  };

  const startGame = () => {
    if (numPlayers >= 5 && numPlayers <= 10) {
      fetch(`/api/v1/games/${roomCode}/start`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => setGame(data));
    }
  };

  const {
    voting,
    vote_result,
    in_progress: inProgress,
    legislative_session,
    draw,
    liberal_policies,
    fascist_policies,
  } = game || {};

  const showPolicyDraw = legislative_session && (
    (player?.president && draw?.length === 3)
    || (player?.chancellor && draw?.length === 2)
  );

  const showVoting = voting && !player?.dead;

  const chancellor = (game?.players || []).find(p => p.chancellor);
  const hitlerIsChancellor = fascist_policies >= 3
    && vote_result === 'pass'
    && chancellor?.role === 'Hitler';

  return (
    <GameContext.Provider value={{ game, setGame, roomCode }}>
      <div className="game">
        <h3 className="hitler-header">
          Remote Secret Hitler Helper
        </h3>
        {!player && (
          <JoinGame
            setPlayerCookie={setPlayerCookie}
            fetchGame={fetchGame}
          />
        )}
        {player && inProgress && (
          <Role
            player={player}
            players={game?.players || []}
          />
        )}
        {player?.dead && (
          <div className="emphasis-center bold-red">
            You are dead. You may not speak, vote, or be elected to government. Do not reveal your party membership to the group unless you are Hitler. If you are Hitler, reveal that to the group and the game is over.
          </div>
        )}
        {hitlerIsChancellor && (
          <div className="emphasis-center bold-red">
            Congratulations! You elected Hitler as Chancellor. The Fascists win!
          </div>
        )}
        {fascist_policies >= 6 && (
          <div className="emphasis-center bold-red">
            The Fascists have successfully passed their agenda. Fascists win!
          </div>
        )}
        {liberal_policies >= 5 && (
          <div className="emphasis-center bold-navy">
            The Liberals have passed their agenda and conquered Fascism. Liberals win!
          </div>
        )}
        {showPolicyDraw && <Policies />}
        <PreviousGovernment />
        <PresidentialPowers player={player} />
        {inProgress && <GameState />}
        {player && !inProgress && (
          <Button icon labelPosition="right" onClick={invite}>
            Copy Invite Link
            <Icon name="copy" />
          </Button>
        )}
        {player && !host && !inProgress && (
          <div>
            Waiting for host to start the game...
          </div>
        )}
        {host && !inProgress && (
          <Button primary disabled={numPlayers < 5} onClick={startGame}>
            Start Game
          </Button>
        )}
        {host && inProgress && !voting && !legislative_session && (
          <ElectionSetup />
        )}
        {showVoting && (
          <Voting setGame={setGame} player={player} />
        )}
        {vote_result && (
          <div>
            {vote_result === 'pass' ? 'Vote Passed!' : 'Vote Failed'}
          </div>
        )}
        {legislative_session && (
          <div>
            {draw.length === 3
              ? 'Waiting for the president to discard a policy'
              : 'Waiting for the chancellor to choose a policy'}
          </div>
        )}
        <div className="players-table">
          <Players game={game} player={player} />
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default Game;
