import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

import "./home.css"
import News from '../news';
import Record from '../record';

export default function Homepage(prop) {
    const {token, setToken} = prop
    const [home, setHome] = React.useState(null);
    const location = useLocation();

    useEffect(() => {
        async function fetchMapImg() {
            try {
                const response = await fetch("https://lp.ardapektezol.com/api/v1/games", {
                    headers: {
                        'Authorization': token
                    }
                });

                const data = await response.json();

                const recommendedMapImg = document.querySelector("#recommendedMapImg");

                recommendedMapImg.src = `${data.data[0].image}`

                const column1 = document.querySelector("#column1");
                const column2 = document.querySelector("#column2");
        
                column2.style.height = column1.clientHeight + "px";
            } catch (error) {
                console.log(error)
            }
        }

        fetchMapImg()

        const panels = document.querySelectorAll(".homepage-panel");
        panels.forEach(e => {
            // this is cuz react is silly
            if (e.innerHTML.includes('<div class="homepage-panel-title-div">')) {
                return
            }
            const title = e.getAttribute("title");

            const titleDiv = document.createElement("div");
            const titleSpan = document.createElement("span");

            titleDiv.classList.add("homepage-panel-title-div")

            titleSpan.innerText = title

            titleDiv.appendChild(titleSpan)
            e.insertBefore(titleDiv, e.firstChild)
        });
    })

    const newsList = [
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
        {
            "title": "Portal Saved on Container Ride",
            "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula facilisis quam, non ultrices nisl aliquam at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
        },
    ]

    return (
        <main>
            <section style={{marginTop: "40px", userSelect: "none"}}>
                <span style={{fontSize: "40px"}}>Welcome back,</span><br/>
                <span><b style={{ fontSize: "96px", transform: "translateY(-20px)", display: "block"}}>Krzyhau</b></span>
            </section>

            <div style={{display: "grid", gridTemplateColumns: "calc(50%) calc(50%)"}}>
                <div id='column1' style={{ display: "flex", alignItems: "self-start", flexWrap: "wrap", alignContent: "start" }}>
                    {/* Column 1 */}
                    <section title="Your Profile" className='homepage-panel'>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px"}}>
                            <div className='stats-div'>
                                <span>Overall rank</span><br/>
                                <span><b>#69</b></span>
                            </div>
                            <div className='stats-div'>
                                <span>Singleplayer</span><br/>
                                <span style={{fontSize: "22px"}}><b>#10</b>&nbsp;(60/62)</span>
                            </div>
                            <div className='stats-div'>
                                <span>Overall rank</span><br/>
                                <span style={{fontSize: "22px"}}><b>#69</b>&nbsp;(13/37)</span>
                            </div>
                        </div>
                    </section>
                    <section title="What's Next?" className='homepage-panel'>
                        <div style={{display: "flex"}}>
                            <img className='recommended-map-img' id="recommendedMapImg"></img>
                            <div style={{marginLeft: "12px", display: "block", width: "100%"}}>
                                <span style={{fontFamily: "BarlowSemiCondensed-SemiBold", fontSize: "32px", width: "100%", display: "block"}}>Container Ride</span>
                                <span style={{fontSize: "20px"}}>Your Record: 4 portals</span>
                                <span style={{fontFamily: "BarlowSemiCondensed-SemiBold", fontSize: "36px", width: "100%", display: "block"}}>World Record: 2 portals</span>
                                <div className='difficulty-bar'>
                                    <div className='difficulty-point' style={{backgroundColor: "#51C355"}}></div>
                                    <div className='difficulty-point'></div>
                                    <div className='difficulty-point'></div>
                                    <div className='difficulty-point'></div>
                                    <div className='difficulty-point'></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section title="Newest Records" className='homepage-panel' style={{height: "250px"}}>
                        <div className='record-title'>
                            <div>
                                <span>Place</span>
                                <span style={{textAlign: "left"}}>Runner</span>
                                <span>Portals</span>
                                <span>Time</span>
                                <span>Date</span>
                            </div>
                        </div>
                        <div style={{overflowY: "scroll", height: "calc(100% - 90px)", paddingRight: "10px"}}>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                            <Record name={"Krzyhau"} portals={"2"} date={new Date("2024-05-21T08:45:00")} place={"2"} time={"20.20"}></Record>
                        </div>
                    </section>
                </div>
                {/* Column 2 */}
                <div id='column2' style={{display: "flex", alignItems: "stretch", height: "0px"}}>
                    <section title="News" className='homepage-panel'>
                        <div id='newsContent' style={{ display: "block", width: "100%", overflowY: "scroll", height: "calc(100% - 50px)"}}>
                            {newsList.map((newsList, index) => (
                                <News newsInfo={newsList} key={index}></News>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            

            
        </main>
    )
}