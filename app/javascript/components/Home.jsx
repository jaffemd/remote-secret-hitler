import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from 'semantic-ui-react';

const Home = () => {
  const [game, setGame] = useState();
  const history = useHistory();

  const handleClick = () => {
    fetch('/api/v1/games', { method: 'post' })
      .then(response => response.json())
      .then(data => setGame(data));
  };

  useEffect(() => {
    if (game) {
      history.push(`/play/${game.room_code}`);
    }
  }, [game]);

  return (
    <div className="home">
      <h3>
        Secret Hitler Helper
      </h3>
      <Button primary onClick={handleClick}>
        Create a new game
      </Button>
    </div>
  );
};

export default Home;
