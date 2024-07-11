import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

import "./record.css"

export default function Record({ name, place, portals, time, date }) {
    // const {token} = prop;
    const [record, setRecord] = useState(null);
    const location = useLocation();

    // useEffect(() => {
    //     console.log(name, place, portals, time, date);
    // })

    function timeSince() {
        const now = new Date();
        const dateNew = new Date(date);
      
        const secondsPast = Math.floor((now - dateNew) / 1000);
      
        if (secondsPast < 60) {
          return `${secondsPast} seconds ago`;
        }
        if (secondsPast < 3600) {
          const minutes = Math.floor(secondsPast / 60);
          return `${minutes} minutes ago`;
        }
        if (secondsPast < 86400) {
          const hours = Math.floor(secondsPast / 3600);
          return `${hours} hours ago`;
        }
        if (secondsPast < 2592000) {
          const days = Math.floor(secondsPast / 86400);
          return `${days} days ago`;
        }
        if (secondsPast < 31536000) {
          const months = Math.floor(secondsPast / 2592000);
          return `${months} months ago`;
        }
        const years = Math.floor(secondsPast / 31536000);
        return `${years} years ago`;
      }

    return(
        <div className='record-container'>
            <span>{place}</span>
            <div style={{display: "flex", alignItems: "center"}}>
                <img style={{height: "40px", borderRadius: "200px"}} src="https://avatars.steamstatic.com/32d110951da2339d8b8d8419bc945d9a2b150b2a_full.jpg"></img>
                <span style={{paddingLeft: "5px", fontFamily: "BarlowSemiCondensed-SemiBold"}}>{name}</span>
            </div>
            <span style={{fontFamily: "BarlowCondensed-Bold", color: "#D980FF"}}>{portals}</span>
            <span>{time}</span>
            <span>{timeSince()}</span>
        </div>
    )
}
