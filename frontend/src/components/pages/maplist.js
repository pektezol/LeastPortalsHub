import React, { useEffect } from 'react';
import { useLocation }  from "react-router-dom";

import "./maplist.css"
import img5 from "../../imgs/5.png"
import img6 from "../../imgs/6.png"

export default function Maplist(prop) {
    const {token,setToken} = prop
    const [games, setGames] = React.useState(null);
    const location = useLocation();
    
    let gameTitle;
    let minPage;
    let maxPage;
    let currentPage;
    async function detectGame() {
        if (location.pathname == "/games/p2-sp"){
            gameTitle = "Portal 2 Singleplayer";

            maxPage = 9;
            minPage = 1;
        } else if (location.pathname == "/games/p2-coop"){
            gameTitle = "Portal 2 Co-op";

            maxPage = 16;
            minPage = 10;
            console.log(minPage, maxPage)
        }

        currentPage = minPage;

        changePage(currentPage);
    }

    async function changePage(page) {
        console.log("changing")
        const data = await fetchMaps(page);
        const maps = data.data.maps;
        const name = data.data.chapter.name;
        console.log(name)
        
        let chapterName = "Chapter";
        const chapterNumberOld = name.split(" - ")[0];
        let chapterNumber1 = chapterNumberOld.split("Chapter ")[1];
        if (chapterNumber1 == undefined) {
            chapterName = "Course"
            chapterNumber1 = chapterNumberOld.split("Course ")[1];
        }
        const chapterNumber = chapterNumber1.toString().padStart(2, "0");
        const chapterTitle = name.split(" - ")[1];

        const chapterNumberElement = document.querySelector(".chapter-num")
        const chapterTitleElement = document.querySelector(".chapter-name")
        chapterNumberElement.innerText = chapterName + " " + chapterNumber;
        chapterTitleElement.innerText = chapterTitle;

        const maplistMaps = document.querySelector(".maplist-maps");
        maplistMaps.innerHTML = "";

        maps.forEach(map => {
            addMap(map.name, "0", 1);
        });

        const gameTitleElement = document.querySelector("#gameTitle");
        gameTitleElement.innerText = gameTitle;

        const pageNumbers = document.querySelector("#pageNumbers");
        pageNumbers.innerText = `${currentPage - minPage + 1}/${maxPage - minPage + 1}`;

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

        asignDifficulties();
    }

    async function addMap(mapName, mapPortalCount, difficulty) {
        // jesus christ
        const maplistItem = document.createElement("div");
        const maplistTitle = document.createElement("span");
        const maplistImgDiv = document.createElement("div");
        const maplistImg = document.createElement("div");
        const maplistPortalcountDiv = document.createElement("div");
        const maplistPortalcount = document.createElement("span");
        const b = document.createElement("b");
        const maplistPortalcountPortals = document.createElement("span");
        const difficultyDiv = document.createElement("div");
        const difficultyLabel = document.createElement("span");
        const difficultyBar = document.createElement("div");
        const difficultyPoint1 = document.createElement("div");
        const difficultyPoint2 = document.createElement("div");
        const difficultyPoint3 = document.createElement("div");
        const difficultyPoint4 = document.createElement("div");
        const difficultyPoint5 = document.createElement("div");

        maplistItem.className = "maplist-item";
        maplistTitle.className = "maplist-title";
        maplistImgDiv.className = "maplist-img-div";
        maplistImg.className = "maplist-img";
        maplistPortalcountDiv.className = "maplist-portalcount-div";
        maplistPortalcount.className = "maplist-portalcount";
        maplistPortalcountPortals.className = "maplist-portals";
        difficultyDiv.className = "difficulty-div";
        difficultyLabel.className = "difficulty-label";
        difficultyBar.className = "difficulty-bar";
        difficultyPoint1.className = "difficulty-point";
        difficultyPoint2.className = "difficulty-point";
        difficultyPoint3.className = "difficulty-point";
        difficultyPoint4.className = "difficulty-point";
        difficultyPoint5.className = "difficulty-point";
        

        maplistTitle.innerText = mapName;
        difficultyLabel.innerText =  "Difficulty: "
        maplistPortalcountPortals.innerText = "portals"
        b.innerText = mapPortalCount;
        difficultyBar.setAttribute("difficulty", difficulty)

        // appends
        // maplist item
        maplistItem.appendChild(maplistTitle);
        maplistImgDiv.appendChild(maplistImg);
        maplistImgDiv.appendChild(maplistPortalcountDiv);
        maplistPortalcountDiv.appendChild(maplistPortalcount);
        maplistPortalcount.appendChild(b);
        maplistPortalcountDiv.appendChild(maplistPortalcountPortals);
        maplistItem.appendChild(maplistImgDiv);
        maplistItem.appendChild(difficultyDiv);
        difficultyDiv.appendChild(difficultyLabel);
        difficultyDiv.appendChild(difficultyBar);
        difficultyBar.appendChild(difficultyPoint1);
        difficultyBar.appendChild(difficultyPoint2);
        difficultyBar.appendChild(difficultyPoint3);
        difficultyBar.appendChild(difficultyPoint4);
        difficultyBar.appendChild(difficultyPoint5);

        // display in place
        const maplistMaps = document.querySelector(".maplist-maps");
        maplistMaps.appendChild(maplistItem);
    }

    async function fetchMaps(chapterID) {
        try{
            const response = await fetch(`https://lp.ardapektezol.com/api/v1/chapters/${chapterID}`, {
                headers: {
                    'Authorization': token
                }
            });

            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err)
        }
    }

    // difficulty stuff
    function asignDifficulties() {
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
    }

    React.useEffect(() => {

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

        detectGame();

        const maplistImg = document.querySelector("#maplistImg");
        maplistImg.src = img5;
        const statisticsImg = document.querySelector("#statisticsImg");
        statisticsImg.src = img6;

        
        console.log(gameTitle)

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

                <div className='gameview-nav'>
                    <button className='game-nav-btn'>
                        <img id='maplistImg'/>
                        <span>Map List</span>
                    </button>
                    <button id='maplistBtn' className='game-nav-btn'>
                        <img id='statisticsImg'/>
                        <span>Statistics</span>
                    </button>
                </div>

                <div className='maplist'>
                    <div className='chapter'>
                        <span className='chapter-num'>undefined</span><br/>
                        <span className='chapter-name'>undefined</span>

                        <div className='chapter-page-div'>
                            <button onClick={() => { currentPage--; currentPage < minPage ? currentPage = minPage : changePage(currentPage); }}>
                                <i className='triangle'></i>
                            </button>
                            <span id='pageNumbers'>0/0</span>
                            <button onClick={() => { currentPage++; currentPage > maxPage ? currentPage = maxPage : changePage(currentPage); }}>
                                <i style={{ transform: "rotate(180deg)" }} className='triangle'></i>
                            </button>
                        </div>
                        
                        <div className='maplist-maps'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
