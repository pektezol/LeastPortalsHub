import React from 'react';
import { Link } from "react-router-dom";

import { Game } from '../types/Game';
import "../css/Games.css"

interface GameEntryProps {
  game: Game;
}

const GameEntry: React.FC<GameEntryProps> = ({ game }) => {

  React.useEffect(() => {
    game.category_portals.forEach(catInfo => {
      const itemBody = document.createElement("div");
      const itemTitle = document.createElement("span");
      const spacing = document.createElement("br");
      const itemNum = document.createElement("span");

      itemTitle.innerText = catInfo.category.name;
      itemNum.innerText = catInfo.portal_count as any as string;
      itemTitle.classList.add("games-page-item-body-item-title");
      itemNum.classList.add("games-page-item-body-item-num");
      itemBody.appendChild(itemTitle);
      itemBody.appendChild(spacing);
      itemBody.appendChild(itemNum);
      itemBody.className = "games-page-item-body-item";

      // itemBody.innerHTML = `
      //             <span className='games-page-item-body-item-title'>${catInfo.category.name}</span><br />
      //             <span className='games-page-item-body-item-num'>${catInfo.portal_count}</span>`

      document.getElementById(`${game.id}`)!.appendChild(itemBody);
    });
  }, []);

  return (
    <Link to={"/games/" + game.id}><div className='games-page-item'>
      <div className='games-page-item-header'>
        <div style={{ backgroundImage: `url(${game.image})` }} className='games-page-item-header-img'></div>
        <span><b>{game.name}</b></span>
      </div>
      <div id={game.id as any as string} className='games-page-item-body'>
      </div>
    </div></Link>
  );
};

export default GameEntry;
