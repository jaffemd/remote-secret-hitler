import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

const Players = ({ game, player }) => (
  Boolean(game?.players?.length) && (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Players</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {game.players.map(({ name, host, id }) => (
          <Table.Row key={name}>
            <Table.Cell>
              <div className="name-cell">
                <span>
                  {name}
                </span>
                {(id === player?.id) && (
                  <span className="you">
                    You
                  </span>
                )}
                {host && (
                  <span className="bold-navy">
                    Host
                  </span>
                )}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
);

Players.propTypes = {
  game: PropTypes.shape({
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
  }),
}
export default Players;
