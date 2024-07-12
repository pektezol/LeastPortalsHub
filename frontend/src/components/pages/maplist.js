import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import "./maplist.css"
import img5 from "../../imgs/5.png"
import img6 from "../../imgs/6.png"

export default function Maplist(prop) {
    const { token, setToken } = prop
    const scrollRef = useRef(null)
    const [games, setGames] = React.useState(null);
    const [hasOpenedStatistics, setHasOpenedStatistics] = React.useState(false);
    const [totalPortals, setTotalPortals] = React.useState(0);
    const [loading, setLoading] = React.useState(true)
    const location = useLocation();

    const [gameTitle, setGameTitle] = React.useState("");
    const [catPortalCount, setCatPortalCount] = React.useState(0);
    let minPage;
    let maxPage;
    let currentPage;
    let add = 0;
    let gameState;
    let catState = 0;
    async function detectGame() {
        const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
            headers: {
                'Authorization': token
            }
        });

        const data = await response.json();

        const url = new URL(window.location.href)

        const params = new URLSearchParams(url.search)
        gameState = parseFloat(location.pathname.split("/")[2])

        if (gameState == 1) {
            setGameTitle(data.data[0].name);

            maxPage = 9;
            minPage = 1;
            createCategories(1);
        } else if (gameState == 2) {
            setGameTitle(data.data[1].name);

            maxPage = 16;
            minPage = 10;
            add = 10
            createCategories(2);
        }

        let chapterParam = params.get("chapter")

        currentPage = minPage;

        if (chapterParam) {
            currentPage = +chapterParam + add
        }

        changePage(currentPage);

        // if (!loading) {

        //     document.querySelector("#catPortalCount").innerText = data.data[gameState - 1].category_portals[0].portal_count;

        // }

        setCatPortalCount(data.data[gameState - 1].category_portals[0].portal_count);

        // if (chapterParam) {
        //     document.querySelector("#pageNumbers").innerText = `${chapterParam - minPage + 1}/${maxPage - minPage + 1}`
        // }
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

                    document.querySelector(".maplist-page").scrollTo({ top: 372, behavior: "smooth" })
                    document.querySelector(".maplist").setAttribute("currentTab", "stats");
                    setHasOpenedStatistics(true);
                }
            } else {
                btn.className = "game-nav-btn";
            }
        });
    }

    async function createCategories(gameID) {
        const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
            headers: {
                'Authorization': token
            }
        });

        const data = await response.json();
        let categoriesArr = data.data[gameID - 1].category_portals;

        if (document.querySelector(".maplist-maps") == null) {
            return;
        }
        const gameNav = document.querySelector(".game-nav");
        gameNav.innerHTML = "";
        categoriesArr.forEach((category) => {
            createCategory(category);
        });

        setLoading(false);
    }

    let categoryNum = 0;
    function createCategory(category) {
        const gameNav = document.querySelector(".game-nav");

        categoryNum++;
        const gameNavBtn = document.createElement("button");
        if (categoryNum == 1) {
            gameNavBtn.className = "game-nav-btn selected";
        } else {
            gameNavBtn.className = "game-nav-btn";
        }
        gameNavBtn.id = "catBtn"
        gameNavBtn.innerText = category.category.name;

        gameNavBtn.addEventListener("click", (e) => {
            changeCategory(category, e);
            changePage(currentPage);
        })

        gameNav.appendChild(gameNavBtn);
    }

    async function changeCategory(category, btn) {
        const navBtns = document.querySelectorAll("#catBtn");
        navBtns.forEach((btns) => {
            btns.classList.remove("selected");
        });

        btn.srcElement.classList.add("selected");
        const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
            headers: {
                'Authorization': token
            }
        });

        const data = await response.json();
        catState = category.category.id - 1;
        // console.log(catState)
        document.querySelector("#catPortalCount").innerText = category.portal_count;
    }

    async function changePage(page) {
        const pageNumbers = document.querySelector("#pageNumbers");

        pageNumbers.innerText = `${currentPage - minPage + 1}/${maxPage - minPage + 1}`;

        const maplistMaps = document.querySelector(".maplist-maps");
        maplistMaps.innerHTML = "";
        for (let index = 0; index < 8; index++) {
            const loadingAnimation = document.createElement("div");
            loadingAnimation.classList.add("loader");
            loadingAnimation.classList.add("loader-map")
            maplistMaps.appendChild(loadingAnimation);
        }
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

        if (document.querySelector(".maplist-maps") == null) {
            return;
        }
        const chapterNumberElement = document.querySelector(".chapter-num")
        const chapterTitleElement = document.querySelector(".chapter-name")
        chapterNumberElement.innerText = chapterName + " " + chapterNumber;
        chapterTitleElement.innerText = chapterTitle;

        maplistMaps.innerHTML = "";
        maps.forEach(map => {
            let portalCount;
            if (map.category_portals[catState] != undefined) {
                portalCount = map.category_portals[catState].portal_count;
            } else {
                portalCount = map.category_portals[0].portal_count;
            }
            addMap(map.name, portalCount, map.image, map.difficulty + 1, map.id);
        });

        const url = new URL(window.location.href)

        const params = new URLSearchParams(url.search)

        let chapterParam = params.get("chapter")

        try {
            const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
                headers: {
                    'Authorization': token
                }
            });

            const data = await response.json();

            const gameImg = document.querySelector(".game-img");

            gameImg.style.backgroundImage = `url(${data.data[0].image})`;

            // const mapImg = document.querySelectorAll(".maplist-img");
            // mapImg.forEach((map) => {
            //     map.style.backgroundImage = `url(${data.data[0].image})`;
            // });

        } catch (error) {
            console.log("error fetching games:", error);
        }

        asignDifficulties();
    }

    async function addMap(mapName, mapPortalCount, mapImage, difficulty, mapID) {
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
        difficultyLabel.innerText = "Difficulty: "
        maplistPortalcountPortals.innerText = "portals"
        b.innerText = mapPortalCount;
        maplistImg.style.backgroundImage = `url(${mapImage})`;
        difficultyBar.setAttribute("difficulty", difficulty)
        maplistItem.setAttribute("id", mapID)
        maplistItem.addEventListener("click", () => {
            console.log(mapID)
            window.location.href = "/maps/" + mapID
        })

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
        try {
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

    const divRef = useRef(null);

    React.useEffect(() => {

        const lineChart = document.querySelector(".line-chart")
        let tempTotalPortals = 0
        fetch("https://lp.ardapektezol.com/api/v1/games/1/maps", {
            headers: {
                'Authorization': token
            }
        })
            .then(r => r.json())
            .then(d => {
                d.data.maps.forEach((map, i) => {
                    tempTotalPortals += map.portal_count
                })
            })
            .then(() => {
                setTotalPortals(tempTotalPortals)
            })
        async function createGraph() {
            console.log(totalPortals)
            // max
            let items = [
                {
                    record: "100",
                    date: new Date(2011, 4, 4),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "98",
                    date: new Date(2012, 6, 4),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "94",
                    date: new Date(2013, 0, 1),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "90",
                    date: new Date(2014, 0, 1),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "88",
                    date: new Date(2015, 6, 14),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "84",
                    date: new Date(2016, 8, 19),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "82",
                    date: new Date(2017, 3, 20),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "81",
                    date: new Date(2018, 2, 25),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "80",
                    date: new Date(2019, 3, 4),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "78",
                    date: new Date(2020, 11, 21),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "77",
                    date: new Date(2021, 10, 25),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "76",
                    date: new Date(2022, 4, 17),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "75",
                    date: new Date(2023, 9, 31),
                    map: "Container Ride",
                    first: "tiny zach"
                },
                {
                    record: "74",
                    date: new Date(2024, 4, 4),
                    map: "Container Ride",
                    first: "tiny zach"
                },
            ]

            function calculatePosition(date, startDate, endDate, maxWidth) {
                const totalMilliseconds = endDate - startDate + 10000000000;
                const millisecondsFromStart = date - startDate + 5000000000;
                return (millisecondsFromStart / totalMilliseconds) * maxWidth
            }

            const minDate = items.reduce((min, dp) => dp.date < min ? dp.date : min, items[0].date)
            const maxDate = items.reduce((max, dp) => dp.date > max ? dp.date : max, items[0].date)

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
                map: dp.map,
                first: dp.first
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
                const thing = calculatePosition(new Date(uniqueYearsArr[index], 0, 0), minDate, maxDate, lineChart.clientWidth)
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

            // Original cubic bezier control points
            const P0 = { x: 0, y: 0 };
            const P1 = { x: 0.26, y: 1 };
            const P2 = { x: 0.74, y: 1 };
            const P3 = { x: 1, y: 0 };

            function calculateIntermediateControlPoints(t, P0, P1, P2, P3) {
                const x = (1 - t) ** 3 * P0.x +
                    3 * (1 - t) ** 2 * t * P1.x +
                    3 * (1 - t) * t ** 2 * P2.x +
                    t ** 3 * P3.x;

                const y = (1 - t) ** 3 * P0.y +
                    3 * (1 - t) ** 2 * t * P1.y +
                    3 * (1 - t) * t ** 2 * P2.y +
                    t ** 3 * P3.y;

                return { x, y };
            }


            let delay = 0;
            for (let index = 0; index < items.length; index++) {
                let chart_height = 340;
                const item = items[index];
                delay += 0.05;
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
                    const t0 = index / items.length;
                    const t1 = (index + 1) / items.length

                    const P0t0 = calculateIntermediateControlPoints(t0, P0, P1, P2, P3);
                    const P1t1 = calculateIntermediateControlPoints(t1, P0, P1, P2, P3);
                    const bezierStyle = `cubic-bezier(${P0t0.x.toFixed(3)}, ${P0t0.y.toFixed(3)}, ${P1t1.x.toFixed(3)}, ${P1t1.y.toFixed(3)})`
                    lineSeg.style.animationTimingFunction = bezierStyle
                    lineSeg.style.animationDelay = delay + "s"
                }
                dataPoint.style.animationDelay = delay + "s"

                let isHoveringOverData = true;
                let isDataActive = false;
                document.querySelector("#dataPointInfo").style.left = item.x + "px";
                document.querySelector("#dataPointInfo").style.bottom = (point_height * item.record - 3) + "px";
                dataPoint.addEventListener("mouseenter", (e) => {
                    isDataActive = true;
                    isHoveringOverData = true;
                    const dataPoints = document.querySelectorAll(".data-point")
                    dataPoints.forEach(point => {
                        point.classList.remove("data-point-active")
                    });
                    dataPoint.classList.add("data-point-active")
                    document.querySelector("#dataPointRecord").innerText = item.record;
                    document.querySelector("#dataPointMap").innerText = item.map;
                    document.querySelector("#dataPointDate").innerText = item.date.toLocaleDateString("en-GB");
                    document.querySelector("#dataPointFirst").innerText = item.first;
                    if ((lineChart.clientWidth - 400) < item.x) {
                        document.querySelector("#dataPointInfo").style.left = item.x - 400 + "px";
                    } else {
                        document.querySelector("#dataPointInfo").style.left = item.x + "px";
                    }
                    if ((lineChart.clientHeight - 115) < (point_height * (item.record - minPortals) - 3)) {
                        document.querySelector("#dataPointInfo").style.bottom = (point_height * (item.record - minPortals) - 3) - 115 + "px";
                    } else {
                        document.querySelector("#dataPointInfo").style.bottom = (point_height * (item.record - minPortals) - 3) + "px";
                    }
                    document.querySelector("#dataPointInfo").style.opacity = "1";
                    document.querySelector("#dataPointInfo").style.zIndex = "10";
                });
                document.querySelector("#dataPointInfo").addEventListener("mouseenter", (e) => {
                    isHoveringOverData = true;
                })
                document.querySelector("#dataPointInfo").addEventListener("mouseleave", (e) => {
                    isHoveringOverData = false;
                })
                document.addEventListener("mousedown", () => {
                    if (!isHoveringOverData) {
                        isDataActive = false
                        dataPoint.classList.remove("data-point-active")
                        document.querySelector("#dataPointInfo").style.opacity = "0";
                        document.querySelector("#dataPointInfo").style.zIndex = "0";
                    }
                })
                dataPoint.addEventListener("mouseenter", (e) => {
                    isHoveringOverData = false;
                })
                document.querySelector(".chart").addEventListener("mouseleave", () => {
                    isDataActive = false
                    // fuck you
                    isHoveringOverData = true;
                    dataPoint.classList.remove("data-point-active")
                    document.querySelector("#dataPointInfo").style.opacity = "0";
                    document.querySelector("#dataPointInfo").style.zIndex = "0";
                })

                li.appendChild(lineSeg);
                li.appendChild(dataPoint);
                lineChart.appendChild(li);
            }
        }

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

                // const mapImg = document.querySelectorAll(".maplist-img");
                // mapImg.forEach((map) => {
                //     map.style.backgroundImage = `url(${data.data[0].image})`;
                // });

            } catch (error) {
                console.log("error fetching games:", error);
            }
        }

        detectGame();

        const maplistImg = document.querySelector("#maplistImg");
        maplistImg.src = img5;
        const statisticsImg = document.querySelector("#statisticsImg");
        statisticsImg.src = img6;

        fetchGames();

        const handleResize = (entries) => {
            for (let entry of entries) {
                if (hasOpenedStatistics) {
                    lineChart.innerHTML = ""
                    createGraph()
                }
                if (document.querySelector(".maplist").getAttribute("currentTab") == "stats") {
                    document.querySelector(".stats").style.display = "block"
                } else {
                    document.querySelector(".stats").style.display = "none"
                }
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);

        // if (scrollRef.current) {
        //     //hi
        //     if (new URLSearchParams(new URL(window.location.href).search).get("chapter")) {
        //         setTimeout(() => {
        //             scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        //         }, 200);
        //     }

        // }

        if (divRef.current) {
            resizeObserver.observe(divRef.current);
        }

        return () => {
            if (divRef.current) {
                resizeObserver.unobserve(divRef.current);
            }
            resizeObserver.disconnect();
        };


    })
    return (
        <div ref={divRef} className='maplist-page'>
            <div className='maplist-page-content'>
                <section className='maplist-page-header'>
                    <Link to='/games'><button className='nav-btn'>
                        <i className='triangle'></i>
                        <span>Games list</span>
                    </button></Link>
                    {!loading ?
                        <span><b id='gameTitle'>{gameTitle}</b></span>
                        :
                        <span><b id='gameTitle' className='loader-text'>LOADINGLOADING</b></span>}
                </section>

                <div className='game'>
                    {!loading ?
                        <div className='game-header'>
                            <div className='game-img'></div>
                            <div className='game-header-text'>
                                <span><b id='catPortalCount'>{catPortalCount}</b></span>
                                <span>portals</span>
                            </div>
                        </div>
                        : <div className='game-header loader'>
                            <div className='game-img'></div>
                            <div className='game-header-text'>
                                <span className='loader-text'><b id='catPortalCount'>00</b></span>
                                <span className='loader-text'>portals</span>
                            </div>
                        </div>}
                    {!loading ?
                        <div className='game-nav'>
                        </div>
                        : <div className='game-nav loader'>
                        </div>}
                </div>

                <div className='gameview-nav'>
                    <button id='maplistBtn' onClick={() => { changeMaplistOrStatistics(0, "maplist") }} className='game-nav-btn selected'>
                        <img id='maplistImg' />
                        <span>Map List</span>
                    </button>
                    <button id='maplistBtn' onClick={() => changeMaplistOrStatistics(1, "stats")} className='game-nav-btn'>
                        <img id='statisticsImg' />
                        <span>Statistics</span>
                    </button>
                </div>

                <div ref={scrollRef} className='maplist'>
                    <div className='chapter'>
                        <span className='chapter-num'>undefined</span><br />
                        <span className='chapter-name'>undefined</span>

                        <div className='chapter-page-div'>
                            <button id='pageChanger' onClick={() => { currentPage--; currentPage < minPage ? currentPage = minPage : changePage(currentPage); }}>
                                <i className='triangle'></i>
                            </button>
                            <span id='pageNumbers'>0/0</span>
                            <button id='pageChanger' onClick={() => { currentPage++; currentPage > maxPage ? currentPage = maxPage : changePage(currentPage); }}>
                                <i style={{ transform: "rotate(180deg)" }} className='triangle'></i>
                            </button>
                        </div>

                        <div className='maplist-maps'>
                        </div>
                    </div>
                </div>

                <div style={{ display: "block" }} className='stats'>
                    <div className='portalcount-over-time-div'>
                        <span className='graph-title'>Portal count over time</span><br />

                        <div className='portalcount-graph'>
                            <figure className='chart'>
                                <div style={{ display: "block" }}></div>
                                <div id="dataPointInfo">
                                    <div className='section-header'>
                                        <span className='header-title'>Date</span>
                                        <span className='header-title'>Map</span>
                                        <span className='header-title'>Record</span>
                                        <span className='header-title'>First completion</span>
                                    </div>
                                    <div className='divider'></div>
                                    <div className='section-data'>
                                        <span id='dataPointDate'></span>
                                        <span id='dataPointMap'></span>
                                        <span id='dataPointRecord'></span>
                                        <span id='dataPointFirst'>Hello</span>
                                    </div>
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