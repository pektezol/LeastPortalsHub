import React, { useEffect, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

import "./games.css"
import GameEntry from './game';

export default function Games(prop) {
    const { token } = prop;
    const [games, setGames] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
                    headers: {
                        'Authorization': token
                    }
                });

                const data = await response.json();
                setGames(data.data);
                pageLoad();
            } catch (err) {
                console.error("Error fetching games:", err);
            }
        };

        fetchGames();

        function pageLoad() {
            const loaders = document.querySelectorAll(".loader");
            loaders.forEach((loader) => {
                loader.style.display = "none";
            });
        }
    }, [token]);

    return (
        <div className='games-page'>
            <section className='games-page-header'>
                <span><b>Games list</b></span>
            </section>

            <section>
                <div className='games-page-content'>
                    <div className='games-page-item-content'>
                        <div className='loader loader-game'></div>
                        <div className='loader loader-game'></div>
                        {games.map((game, index) => (
                            <GameEntry gameInfo={game} key={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
