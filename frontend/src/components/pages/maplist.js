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
            createCategories(1);
        } else if (location.pathname == "/games/p2-coop"){
            gameTitle = "Portal 2 Co-op";

            maxPage = 16;
            minPage = 10;
            createCategories(2);
        }

        currentPage = minPage;

        changePage(currentPage);
    }

    function changeMaplistOrStatistics(index, name) {
            const maplistBtns = document.querySelectorAll("#maplistBtn");
            maplistBtns.forEach((btn, i) => {
            if (i == index) {
                btn.className = "game-nav-btn selected"

                if (name == "maplist") {
                    document.querySelector(".stats").style.display = "none";
                    document.querySelector(".maplist").style.display = "block";
                    document.querySelector(".maplist").setAttribute("currentTab", "maplist");
                } else {
                    document.querySelector(".stats").style.display = "block";
                    document.querySelector(".maplist").style.display = "none";
                    document.querySelector(".maplist").setAttribute("currentTab", "stats");
                }
            } else {
                btn.className = "game-nav-btn";
            }
        });
    }

    function createCategories(gameID) {
        let categoriesArr;
        if (gameID == 1) {
            // Portal 2 Singleplayer
            categoriesArr = [
                "Challenge Mode",
                "NoSLA",
                "Inbounds SLA",
                "Any%",
            ]
        } else if (gameID == 2) {
            categoriesArr = [
                "Challenge Mode",
                "All Courses",
                "Any%",
            ]
        }

        categoriesArr.forEach((category) => {
            createCategory(category);
        });
    }

    let categoryNum = 0;
    function createCategory(categoryName) {
        categoryNum++;
        const gameNavBtn = document.createElement("button");
        if (categoryNum == 1) {
            gameNavBtn.className = "game-nav-btn selected";
        } else {
            gameNavBtn.className = "game-nav-btn";
        }
        gameNavBtn.innerText = categoryName;

        const gameNav = document.querySelector(".game-nav");
        gameNav.appendChild(gameNavBtn);
    }

    async function changePage(page) {
        const data = await fetchMaps(page);
        const maps = data.data.maps;
        const name = data.data.chapter.name;
        
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

        const lineChart = document.querySelector(".line-chart")
        function createGraph() {
            // max
            let items = [
                {
                  record: "100",
                  x: '20',
                  date: new Date(2018, 4, 4)
                },
                {
                  record: "90",
                  x: '300',
                  date: new Date(2019, 6, 4)
                },
                {
                  record: "88",
                  x: '600',
                  date: new Date(2020, 0, 1)
                },
                {
                  record: "80",
                  x: '1100',
                  date: new Date(2022, 6, 14)
                },
                {
                  record: "78",
                  x: '1170',
                  date: new Date(2022, 8, 19)
                },
                {
                  record: "76",
                  x: '1200',
                  date: new Date(2023, 3, 20)
                },
                {
                  record: "74",
                  x: '1250',
                  date: new Date(2024, 2, 25)
                },
            ]

            function calculatePosition(date, startDate, endDate, maxWidth) {
                const totalMilliseconds = endDate - startDate + 10000000000;
                const millisecondsFromStart = date - startDate + 5000000000;
                return (millisecondsFromStart / totalMilliseconds) * maxWidth
            }

            const minDate = items.reduce((min, dp) => dp.date < min ? dp.date : min, items[0].date)
            const maxDate = items.reduce((max, dp) => dp.date > max ? dp.date : max, items[0].date)

            console.log(minDate, maxDate)
            console.log(lineChart.clientWidth)

            const graph_width = document.querySelector(".portalcount-over-time-div").clientWidth
            // console.log(graph_width)
            
            const uniqueYears = new Set()
            items.forEach(dp => uniqueYears.add(dp.date.getFullYear()))
            let minYear = Infinity;
            let maxYear = -Infinity;

            items.forEach(dp => {
                const year = dp.date.getFullYear();
                minYear = Math.min(minYear, year);
                maxYear = Math.max(maxYear, year);
            });

            // Add missing years to the set
            for (let year = minYear; year <= maxYear; year++) {
                uniqueYears.add(year);
            }
            const uniqueYearsArr = Array.from(uniqueYears)

            items = items.map(dp => ({
                record: dp.record,
                date: dp.date,
                x: calculatePosition(dp.date, minDate, maxDate, lineChart.clientWidth),
            }))
            
            const yearInterval = lineChart.clientWidth / uniqueYears.size
            for (let index = 1; index < (uniqueYears.size); index++) {
                const placeholderlmao = document.createElement("div")
                const yearSpan = document.createElement("span")
                yearSpan.style.position = "absolute"
                placeholderlmao.style.height = "100%"
                placeholderlmao.style.width = "2px"
                placeholderlmao.style.backgroundColor = "#00000080"
                placeholderlmao.style.position = `absolute`
                console.log(uniqueYearsArr[index])
                const thing = calculatePosition(new Date(uniqueYearsArr[index], 0, 0), minDate, maxDate, lineChart.clientWidth)
                console.log(thing)
                placeholderlmao.style.left = `${thing}px`
                yearSpan.style.left = `${thing}px`
                yearSpan.style.bottom = "-34px"
                yearSpan.innerText = uniqueYearsArr[index]
                yearSpan.style.fontFamily = "BarlowSemiCondensed-Regular"
                yearSpan.style.fontSize = "22px"
                yearSpan.style.opacity = "0.8"
                lineChart.appendChild(yearSpan)
                
            }

            let maxPortals;
            let minPortals;
            let precision;
            let multiplier = 1;
            for (let index = 0; index < items.length; index++) {
                console.log(items[0].record - items[items.length - 1].record)
                precision = Math.floor((items[0].record - items[items.length - 1].record))
                if (precision > 20) {
                    precision = 20
                }
                minPortals = Math.floor((items[items.length - 1].record) / 10) * 10
                if (index == 0) {
                    maxPortals = items[index].record - minPortals
                }
            }
            function calculateMultiplier(value) {
                while (value > precision) {
                    multiplier += 1;
                    value -= precision;
                }
            }
            calculateMultiplier(items[0].record);
            // if (items[0].record > 10) {
            //     multiplier = 2;
            // }
            
            
            for (let index = 0; index < items.length; index++) {
                let chart_height = 340;
                const item = items[index];
                // console.log(lineChart.clientWidth)

                // maxPortals++;
                // maxPortals++;

                let point_height = (chart_height / maxPortals)

                for (let index = 0; index < (maxPortals / multiplier); index++) {
                    // console.log((index + 1) * multiplier)
                    let current_portal_count = (index + 1);

                    const placeholderDiv = document.createElement("div")
                    const numPortalsText = document.createElement("span")
                    const numPortalsTextBottom = document.createElement("span")
                    numPortalsText.innerText = (current_portal_count * multiplier) + minPortals
                    numPortalsTextBottom.innerText = minPortals
                    placeholderDiv.style.position = "absolute"
                    numPortalsText.style.position = "absolute"
                    numPortalsTextBottom.style.position = "absolute"
                    numPortalsText.style.left = "-37px"
                    numPortalsText.style.opacity = "0.2"
                    numPortalsTextBottom.style.opacity = "0.2"
                    numPortalsText.style.fontFamily = "BarlowSemiCondensed-Regular"
                    numPortalsTextBottom.style.fontFamily = "BarlowSemiCondensed-Regular"
                    numPortalsText.style.fontSize = "22px"
                    numPortalsTextBottom.style.left = "-37px"
                    numPortalsTextBottom.style.fontSize = "22px"
                    numPortalsTextBottom.style.fontWeight = "400"
                    numPortalsText.style.color = "#CDCFDF"
                    numPortalsTextBottom.style.color = "#CDCFDF"
                    numPortalsText.style.fontFamily = "inherit"
                    numPortalsTextBottom.style.fontFamily = "inherit"
                    numPortalsText.style.textAlign = "right"
                    numPortalsTextBottom.style.textAlign = "right"
                    numPortalsText.style.width = "30px"
                    numPortalsTextBottom.style.width = "30px"
                    placeholderDiv.style.bottom = `${(point_height * current_portal_count * multiplier) - 2}px`
                    numPortalsText.style.bottom = `${(point_height * current_portal_count * multiplier) - 2 - 9}px`
                    numPortalsTextBottom.style.bottom = `${0 - 2 - 8}px`
                    placeholderDiv.id = placeholderDiv.style.bottom
                    placeholderDiv.style.width = "100%"                
                    placeholderDiv.style.height = "2px"      
                    placeholderDiv.style.backgroundColor = "#2B2E46"
                    placeholderDiv.style.zIndex = "0"
                    
                    if (index == 0) {
                        lineChart.appendChild(numPortalsTextBottom)
                    }
                    lineChart.appendChild(numPortalsText)
                    lineChart.appendChild(placeholderDiv)
                }

                const li = document.createElement("li");
                const lineSeg = document.createElement("div");
                const dataPoint = document.createElement("div");

                li.style = `--y: ${point_height * (item.record - minPortals) - 3}px; --x: ${item.x}px`;
                lineSeg.className = "line-segment";
                dataPoint.className = "data-point";

                if (items[index + 1] !== undefined) {
                    const hypotenuse = Math.sqrt(
                        Math.pow(items[index + 1].x - items[index].x, 2) +
                        Math.pow((point_height * items[index + 1].record) - point_height * item.record, 2)
                    );
                    const angle = Math.asin(
                        ((point_height * item.record) - (point_height * items[index + 1].record)) / hypotenuse
                    );

                    lineSeg.style = `--hypotenuse: ${hypotenuse}; --angle: ${angle * (-180 / Math.PI)}`;
                }
                
                document.querySelector("#dataPointInfo").style.left = item.x + "px";
                document.querySelector("#dataPointInfo").style.bottom = (point_height * item.record -3) + "px";
                li.addEventListener("mouseenter", (e) => {
                    document.querySelector("#dataPointName").innerText = item.record;
                    if ((lineChart.clientWidth / 2) < item.x) {
                      document.querySelector("#dataPointInfo").style.left = item.x - 400 + "px";
                    } else {
                      document.querySelector("#dataPointInfo").style.left = item.x + "px";
                    }
                    if ((lineChart.clientHeight / 2) < (point_height * item.record -3)) {
                        document.querySelector("#dataPointInfo").style.bottom = (point_height * (item.record - minPortals) -3) - 115 + "px";
                    } else {
                        document.querySelector("#dataPointInfo").style.bottom = (point_height * (item.record - minPortals) -3) + "px";
                    }
                    document.querySelector("#dataPointInfo").style.opacity = "1";
                    document.querySelector("#dataPointInfo").style.zIndex = "10";
                });
                document.addEventListener("mousedown", () => {
                    document.querySelector("#dataPointInfo").style.opacity = "0";
                    setTimeout(() => {
                        document.querySelector("#dataPointInfo").style.zIndex = "0";
                    }, 300);
                })
                document.querySelector(".chart").addEventListener("mouseleave", () => {
                    document.querySelector("#dataPointInfo").style.opacity = "0";
                    setTimeout(() => {
                        document.querySelector("#dataPointInfo").style.zIndex = "0";
                    }, 300);
                })

                li.appendChild(lineSeg);
                li.appendChild(dataPoint);
                lineChart.appendChild(li);
            }
        }

        createGraph()

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

        if (document.querySelector(".maplist").getAttribute("currentTab") == "stats") {
            document.querySelector(".stats").style.display = "block"
        } else {
            document.querySelector(".stats").style.display = "none"
        }
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
                    </div>
                </div>

                <div className='gameview-nav'>
                    <button id='maplistBtn' onClick={() => {changeMaplistOrStatistics(0, "maplist")}} className='game-nav-btn selected'>
                        <img id='maplistImg'/>
                        <span>Map List</span>
                    </button>
                    <button id='maplistBtn' onClick={() => changeMaplistOrStatistics(1, "stats")} className='game-nav-btn'>
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

                <div style={{display: "block"}} className='stats'>
                    <div className='portalcount-over-time-div'>
                        <span className='graph-title'>Portal count over time</span><br/>

                        <div className='portalcount-graph'>
                            <figure className='chart'>
                                <div style={{display: "block"}}></div>
                                <div id="dataPointInfo">
                                    <span id='dataPointName'></span>
                                </div>
                                <ul className='line-chart'>
                                    
                                </ul>
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
