import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

import "./games.css"

import GameCategory from './gamecat';

export default function GameEntry({ gameInfo }) {
    const [gameEntry, setGameEntry] = React.useState(null);
    const location = useLocation();

    const gameInfoCats = gameInfo.category_portals;

    // useEffect(() => {
    //     gameInfoCats.forEach(catInfo => {
    //         const itemBody = document.createElement("div");
    //         const itemTitle = document.createElement("span");
    //         const spacing = document.createElement("br");
    //         const itemNum = document.createElement("span");

    //         itemTitle.innerText = catInfo.category.name;
    //         itemNum.innerText = catInfo.portal_count;
    //         itemTitle.classList.add("games-page-item-body-item-title");
    //         itemNum.classList.add("games-page-item-body-item-num");
    //         itemBody.appendChild(itemTitle);
    //         itemBody.appendChild(spacing);
    //         itemBody.appendChild(itemNum);
    //         itemBody.className = "games-page-item-body-item";
    
    //         // itemBody.innerHTML = `
    //         //             <span className='games-page-item-body-item-title'>${catInfo.category.name}</span><br />
    //         //             <span className='games-page-item-body-item-num'>${catInfo.portal_count}</span>`
    
    //         document.getElementById(`${gameInfo.id}`).appendChild(itemBody);
    //     });
    // })

    return (
        <Link to={"/games/" + gameInfo.id}><div className='games-page-item'>
            <div className='games-page-item-header'>
                <div style={{backgroundImage: `url(${gameInfo.image})`}} className='games-page-item-header-img'></div>
                <span><b>{gameInfo.name}</b></span>
            </div>
            <div id={gameInfo.id} className='games-page-item-body'>
                {gameInfoCats.map((cat, i) => {
                    return <GameCategory iteration={i} gameinfo={gameInfo} cat={cat} key={i}></GameCategory>
                })}
            </div>
        </div></Link>
    )
}
