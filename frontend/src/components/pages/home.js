import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

import "./home.css"
import News from '../news';

export default function Homepage(prop) {
    const {token} = prop
    const [home, setHome] = React.useState(null);
    const location = useLocation();

    useEffect(() => {
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
    ]

    return (
        <main>
            <section style={{marginTop: "40px", userSelect: "none"}}>
                <span style={{fontSize: "40px"}}>Welcome back,</span><br/>
                <span><b style={{ fontSize: "96px", transform: "translateY(-20px)", display: "block"}}>Krzyhau</b></span>
            </section>

            <div style={{display: "grid", gridTemplateColumns: "calc(50% - 45px) calc(50% - 45px)"}}>
                <div style={{ display: "flex", alignItems: "self-start", flexWrap: "wrap", alignContent: "start" }}>
                    {/* Column 1 */}
                    <section title="Your Profile" className='homepage-panel'>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", paddingTop: "10px"}}>
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

                    </section>
                    <section title="Newest Records" className='homepage-panel'>

                    </section>
                </div>
                {/* Column 2 */}
                <div style={{display: "flex", alignItems: "stretch"}}>
                    <section title="News" className='homepage-panel'>
                        <div id='newsContent' style={{ display: "block", width: "100%" }}>
                            {newsList.map((newsList, index) => (
                                <News yuh={newsList} key={index}></News>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            

            
        </main>
    )
}