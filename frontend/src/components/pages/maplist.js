import React, { useEffect } from 'react';
import { useLocation }  from "react-router-dom";

import "./maplist.css"

export default function Maplist(prop) {
    const {token,setToken} = prop
    const [games, setGames] = React.useState(null);
    const location = useLocation();

    let gameTitle;

    React.useEffect(() => {
        if (location.pathname == "/games/p2-sp"){
            gameTitle = "Portal 2 Singleplayer";
        } else if (location.pathname == "/games/p2-coop"){
            gameTitle = "Portal 2 Co-op";
        }

        const gameTitleElement = document.querySelector("#gameTitle");
        gameTitleElement.innerText = gameTitle;

        async function fetchGames() {
            try {
                const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
                    headers: {
                        'Authorization': token
                    }
                });

                const data = await response.json();

                const gameImg = document.querySelector(".game-img");

                gameImg.style.backgroundImage = `url(${data.data[0].image})`;

            } catch (error) {
                console.log("error fetching games:", error);
            }
        }

        fetchGames();
    })
    return (
        <div className='maplist-page'>
            <div className='maplist-page-content'>
                <section className='maplist-page-header'>
                    <a href='/games'><button className='nav-btn'>
                        <i className='triangle'></i>
                        <span>Games list</span>
                    </button></a>
                    <span><b id='gameTitle'>undefined</b></span>
                </section>

                <div className='game'>
                    <div className='game-header'>
                        <div className='game-img'></div>
                        <div className='game-header-text'>
                            <span><b>74</b></span>
                            <span>portals</span>
                        </div>
                    </div>

                    <div className='game-nav'>
                        <button className='game-nav-btn'>Challenge Mode</button>
                        <button className='game-nav-btn'>NoSLA</button>
                        <button className='game-nav-btn'>Inbounds SLA</button>
                        <button className='game-nav-btn'>Any%</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
