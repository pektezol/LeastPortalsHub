import React, { useEffect } from 'react';
import { useLocation }  from "react-router-dom";

import "./maplist.css"
import img5 from "../../imgs/5.png"

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

                const mapImg = document.querySelectorAll(".maplist-img");
                mapImg.forEach((map) => {
                    map.style.backgroundImage = `url(${data.data[0].image})`;
                });

            } catch (error) {
                console.log("error fetching games:", error);
            }
        }

        fetchGames();

        const maplistImg = document.querySelector("#maplistImg");
        maplistImg.src = img5;

        // difficulty stuff
        const difficulties = document.querySelectorAll(".difficulty-bar");
        difficulties.forEach((difficultyElement) => {
            let difficulty = difficultyElement.getAttribute("difficulty");
            if (difficulty == "1") {
                difficultyElement.childNodes[0].style.backgroundColor = "#51C355";
            } else if (difficulty == "2") {
                difficultyElement.childNodes[0].style.backgroundColor = "#8AC93A";
                difficultyElement.childNodes[1].style.backgroundColor = "#8AC93A";
            } else if (difficulty == "3") {
                difficultyElement.childNodes[0].style.backgroundColor = "#8AC93A";
                difficultyElement.childNodes[1].style.backgroundColor = "#8AC93A";
                difficultyElement.childNodes[2].style.backgroundColor = "#8AC93A";
            } else if (difficulty == "4") {
                difficultyElement.childNodes[0].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[1].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[2].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[3].style.backgroundColor = "#C35F51";
            } else if (difficulty == "5") {
                difficultyElement.childNodes[0].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[1].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[2].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[3].style.backgroundColor = "#C35F51";
                difficultyElement.childNodes[4].style.backgroundColor = "#C35F51";
            }
        });
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

                <div className='gameview-nav'>
                    <button className='game-nav-btn'>
                        <img id='maplistImg'/>
                        <span>Map List</span>
                    </button>
                    <button id='maplistBtn' className='game-nav-btn'>Map List</button>
                </div>

                <div className='maplist'>
                    <div className='chapter'>
                        <span className='chapter-num'>Chapter 01</span><br/>
                        <span className='chapter-name'>The Courtesy Call</span>
                        
                        <div className='maplist-maps'>
                            <div className='maplist-item'>
                                <span className='maplist-title'>Container Ride</span>
                                <div className='maplist-img-div'>
                                    <div className='maplist-img'></div>
                                    <div className='maplist-portalcount-div'>
                                        <span className='maplist-portalcount'><b>0</b></span>
                                        <span className='maplist-portals'>portals</span>
                                    </div>
                                </div>
                                <div className='difficulty-div'>
                                    <span className='difficulty-label'>Difficulty: </span>
                                    <div difficulty="1" className='difficulty-bar'>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='maplist-item'>
                                <span className='maplist-title'>Container Ride</span>
                                <div className='maplist-img-div'>
                                    <div className='maplist-img'></div>
                                    <div className='maplist-portalcount-div'>
                                        <span className='maplist-portalcount'><b>0</b></span>
                                        <span className='maplist-portals'>portals</span>
                                    </div>
                                </div>
                                <div className='difficulty-div'>
                                    <span className='difficulty-label'>Difficulty: </span>
                                    <div difficulty="2" className='difficulty-bar'>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='maplist-item'>
                                <span className='maplist-title'>Container Ride</span>
                                <div className='maplist-img-div'>
                                    <div className='maplist-img'></div>
                                    <div className='maplist-portalcount-div'>
                                        <span className='maplist-portalcount'><b>0</b></span>
                                        <span className='maplist-portals'>portals</span>
                                    </div>
                                </div>
                                <div className='difficulty-div'>
                                    <span className='difficulty-label'>Difficulty: </span>
                                    <div difficulty="3" className='difficulty-bar'>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='maplist-item'>
                                <span className='maplist-title'>Container Ride</span>
                                <div className='maplist-img-div'>
                                    <div className='maplist-img'></div>
                                    <div className='maplist-portalcount-div'>
                                        <span className='maplist-portalcount'><b>0</b></span>
                                        <span className='maplist-portals'>portals</span>
                                    </div>
                                </div>
                                <div className='difficulty-div'>
                                    <span className='difficulty-label'>Difficulty: </span>
                                    <div difficulty="4" className='difficulty-bar'>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='maplist-item'>
                                <span className='maplist-title'>Container Ride</span>
                                <div className='maplist-img-div'>
                                    <div className='maplist-img'></div>
                                    <div className='maplist-portalcount-div'>
                                        <span className='maplist-portalcount'><b>0</b></span>
                                        <span className='maplist-portals'>portals</span>
                                    </div>
                                </div>
                                <div className='difficulty-div'>
                                    <span className='difficulty-label'>Difficulty: </span>
                                    <div difficulty="5" className='difficulty-bar'>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                        <div className='difficulty-point'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
