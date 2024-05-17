import React, { useEffect } from 'react';
import { useLocation, Link }  from "react-router-dom";

import "./games.css"

export default function Games(prop) {
    const {token} = prop
    const [games, setGames] = React.useState(null);
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

                const headers = document.querySelectorAll(".games-page-item-header-img");
                headers.forEach((header) => {
                        header.style.backgroundSize = "cover";
                    if (header.id == "sp") {
                        header.style.backgroundImage = `url(${data.data[0].image})`;
                    } else if (header.id == "mp") {
                        header.style.backgroundImage = `url(${data.data[1].image})`;
                    } else {
                        header.style.backgroundImage = `url(${data.data[0].image})`;
                    }
                });
            } catch (err) {
                console.error("Error fetching games:", err);
            }
        }

        fetchGames();
    }, []);

    return (
        <div className='games-page'>
            <section className='games-page-header'>
                <span><b>Games list</b></span>
            </section>

            <section>
                <div className='games-page-content'>
                    <div className='games-page-item-content'>
                    <Link to='/games/p2-sp'><div className='games-page-item'>
                        <div className='games-page-item-header'>
                            <div id="sp" className='games-page-item-header-img'></div>
                            <span><b>Portal 2 Singleplayer</b></span>
                        </div>
                        <div className='games-page-item-body'>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Challenge Mode</span><br/>
                                <span className='games-page-item-body-item-num'>74</span>
                            </div>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>NoSLA</span><br/>
                                <span className='games-page-item-body-item-num'>54</span>
                            </div>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Inbounds SLA</span><br/>
                                <span className='games-page-item-body-item-num'>46</span>
                            </div>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Any%</span><br/>
                                <span className='games-page-item-body-item-num'>3</span>
                            </div>
                        </div>
                    </div></Link>
                    <Link to='/games/p2-coop'><div className='games-page-item'>
                        <div className='games-page-item-header'>
                            <div id='mp' className='games-page-item-header-img'></div>
                            <span><b>Portal 2 Co-op</b></span>
                        </div>
                        <div className='games-page-item-body'>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Challenge Mode</span><br/>
                                <span className='games-page-item-body-item-num'>45</span>
                            </div>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>All Courses</span><br/>
                                <span className='games-page-item-body-item-num'>53</span>
                            </div>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Any%</span><br/>
                                <span className='games-page-item-body-item-num'>12</span>
                            </div>
                        </div>
                    </div></Link>
                    <Link to='/games/psm'><div className='games-page-item'>
                        <div className='games-page-item-header'>
                            <div className='games-page-item-header-img'></div>
                            <span><b>Portal Stories: Mel</b></span>
                        </div>
                        <div className='games-page-item-body'>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Story Mode</span><br/>
                                <span className='games-page-item-body-item-num'>69</span>
                            </div>
                            <div className='games-page-item-body-item'>
                                <span className='games-page-item-body-item-title'>Advanced Mode</span><br/>
                                <span className='games-page-item-body-item-num'>69</span>
                            </div>
                        </div>
                    </div></Link>

                    </div>
                    
                </div>
            </section>
        </div>
    )
}
