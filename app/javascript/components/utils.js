export const idSort = (a, b) => {
  if (a.id > b.id) {
    return 1;
  }
  if (b.id > a.id) {
    return -1;
  }
  return 0;
};

export const powersMap = {
  INVESTIGATE: 'Investigate Loyalty',
  SPECIAL_ELECTION: 'Call Special Election',
  PEEK: 'Policy Peek',
  EXECUTION: 'Execution',
};

export const playerOptions = game => (game?.players || [])
  .sort(idSort)
  .filter(p => !p.dead)
  .map(p => ({
    key: p.id, text: p.name, value: p.id,
  }));

export const putGameUpdate = ({ action, setGame, roomCode }) => () => {
  fetch(`/api/v1/games/${roomCode}/${action}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => setGame(data));
};
