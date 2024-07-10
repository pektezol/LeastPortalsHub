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

                const headers = document.querySelectorAll(".games-page-item-header-img");
                headers.forEach((header) => {
                    header.style.backgroundSize = "cover";
                    if (header.id === "sp") {
                        header.style.backgroundImage = `url(${data.data[0].image})`;
                    } else if (header.id === "mp") {
                        header.style.backgroundImage = `url(${data.data[1].image})`;
                    } else {
                        header.style.backgroundImage = `url(${data.data[0].image})`;
                    }
                });
            } catch (err) {
                console.error("Error fetching games:", err);
            }
        };

        fetchGames();
    }, [token]);

    return (
        <div className='games-page'>
            <section className='games-page-header'>
                <span><b>Games list</b></span>
            </section>

            <section>
                <div className='games-page-content'>
                    <div className='games-page-item-content'>
                        {games.map((game, index) => (
                            <GameEntry gameInfo={game} key={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
