import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { idSort } from './utils';

const Players = ({ game, player }) => {
  const showVote = id => (!game.voting || player.id === id);

  const players = !game ? [] : game.players.sort(idSort);

  return Boolean(players.length) && (
    <Table celled unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Players</Table.HeaderCell>
          {game?.in_progress && (
            <Table.HeaderCell>Vote</Table.HeaderCell>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {game.players.map(({
          name,
          host,
          id,
          vote,
          chancellor,
          president,
        }) => (
          <Table.Row key={name}>
            <Table.Cell>
              <div>
                <div className="name-cell">
                  <span>
                    {name}
                  </span>
                  {(id === player?.id) && (
                    <span className="bold-red">
                      You
                    </span>
                  )}
                  {host && (
                    <span className="bold-navy">
                      Host
                    </span>
                  )}
                </div>
                {president && (
                  <div className="player-government-role">
                    President
                  </div>
                )}
                {chancellor && (
                  <div className="player-government-role">
                    Chancellor
                  </div>
                )}
              </div>
            </Table.Cell>
            {game.in_progress && (
              <Table.Cell
                positive={showVote(id) && vote === 'yes'}
                negative={showVote(id) && vote === 'no'}
              >
                {game.voting && vote && player.id !== id && 'Voted'}
                {showVote(id) && vote === 'yes' && 'Ja!'}
                {showVote(id) && vote === 'no' && 'Nein!'}
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

Players.propTypes = {
  game: PropTypes.shape({
    in_progress: PropTypes.bool,
    voting: PropTypes.bool,
    room_code: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
      host: PropTypes.bool,
    })),
  }),
  player: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    host: PropTypes.bool,
    vote: PropTypes.string,
    chancellor: PropTypes.bool,
    president: PropTypes.bool,
  }),
};
Players.defaultProps = { game: undefined, player: undefined };
export default Players;
