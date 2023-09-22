import React from 'react';
import { Link, useLocation } from "react-router-dom";

import "../App.css"
import "./sidebar.css";
import logo from "../imgs/logo.png"
import img1 from "../imgs/1.png"
import img2 from "../imgs/2.png"
import img3 from "../imgs/3.png"
import img4 from "../imgs/4.png"
import img5 from "../imgs/5.png"
import img6 from "../imgs/6.png"
import img7 from "../imgs/7.png"
import img8 from "../imgs/8.png"
import img9 from "../imgs/9.png"
import Login from "./login.js"

export default function Sidebar(prop) {
const {token,setToken} = prop

// Locks search button for 300ms before it can be clicked again, prevents spam
const [isLocked, setIsLocked] = React.useState(false);
function HandleLock(arg) {
if (!isLocked) {
    setIsLocked(true);
        setTimeout(() => setIsLocked(false), 300);
    SidebarHide(arg)
    }
}


// Clicked buttons
function SidebarClick(x){
const btn = document.querySelectorAll("button.sidebar-button");

if(sidebar===1){setSidebar(0);SidebarHide()}

btn.forEach((e,i) =>{
    btn[i].style.backgroundColor="inherit"
}) 
btn[x].style.backgroundColor="#202232"

}


// The menu button
const [sidebar, setSidebar] = React.useState();

function SidebarHide(){
const btn   = document.querySelectorAll("button.sidebar-button")
const span  = document.querySelectorAll("button.sidebar-button>span");
const side  = document.querySelector("#sidebar-list");
const login = document.querySelectorAll(".login>button")[1];

if(sidebar===1){
    setSidebar(0)
    side.style.width="320px"
    btn.forEach((e, i) =>{
        e.style.width="310px"
        setTimeout(() => {
            span[i].style.opacity="1"
            login.style.opacity="1"

        }, 100)
    })
    side.style.zIndex="2"
} else {
    side.style.width="40px";
    setSidebar(1)
    btn.forEach((e,i) =>{
        e.style.width="40px"
        span[i].style.opacity="0"
    }) 
    login.style.opacity="0"
    setTimeout(() => {
        side.style.zIndex="0"
    }, 300);
    }
}

// Links
const location = useLocation()
React.useEffect(()=>{
    if(location.pathname==="/"){SidebarClick(1)}
    if(location.pathname.includes("news")){SidebarClick(2)}
    if(location.pathname.includes("records")){SidebarClick(3)}
    if(location.pathname.includes("leaderboards")){SidebarClick(4)}
    if(location.pathname.includes("discussions")){SidebarClick(5)}
    if(location.pathname.includes("scorelog")){SidebarClick(6)}
    if(location.pathname.includes("profile")){SidebarClick(7)}
    if(location.pathname.includes("rules")){SidebarClick(9)}
    if(location.pathname.includes("about")){SidebarClick(10)}

    // eslint-disable-next-line react-hooks/exhaustive-deps
},  [location.pathname])

const [search,setSearch] = React.useState(null)
const [searchData,setSearchData] = React.useState(null)
React.useEffect(()=>{
    fetch(`https://lp.ardapektezol.com/api/v1/search?q=${search}`)
        .then(r=>r.json())
        .then(d=>setSearchData(d.data))

}, [search])


return (
    <div id='sidebar'>
        <div id='logo'> {/* logo */}
            <img src={logo} alt="" height={"80px"}/>
            <div id='logo-text'>
                <span><b>PORTAL 2</b></span><br/>
                <span>Least Portals</span>
            </div>
        </div>
        <div id='sidebar-list'> {/* List */}
            <div id='sidebar-toplist'> {/* Top */} 

                <button className='sidebar-button' onClick={()=>HandleLock()}><img src={img1} alt="" /><span>Search</span></button>

                <span></span>
                
                <Link to="/" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img2} alt="" /><span>Home&nbsp;Page</span></button>
                </Link>

                <Link to="/news" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img3} alt="" /><span>News</span></button>
                </Link>

                <Link to="/records" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img4} alt="" /><span>Records</span></button>
                </Link>

                <Link to="/leaderboards" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img5} alt="" /><span>Leaderboards</span></button>
                </Link>

                <Link to="/discussions" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img6} alt="" /><span>Discussions</span></button>
                </Link>

                <Link to="/scorelog" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img7} alt="" /><span>Score&nbsp;Logs</span></button>
                </Link>
            </div>
            <div id='sidebar-bottomlist'>
                <span></span>

                <Login token={token} setToken={setToken}/>

                <Link to="/rules" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img8} alt="" /><span>Leaderboard&nbsp;Rules</span></button>
                </Link>

                <Link to="/about" tabIndex={-1}>
                    <button className='sidebar-button'><img src={img9} alt="" /><span>About&nbsp;P2LP</span></button>
                </Link>
            </div>
        </div>
        <div> 
            <input type="text" id='searchbar' placeholder='Search for map or a player...' onChange={()=>setSearch(document.querySelector("#searchbar").value)}/>

            <div id='search-data'>

            {searchData!==null?searchData.maps.map((q,index)=>(
                <Link to={`/maps/${q.id}`} className='search-map' key={index}>
                    <span>{q.game}</span>
                    <span>{q.chapter}</span>
                    <span>{q.map}</span>
                </Link>
            )):""}
            {searchData!==null?searchData.players.map((q,index)=>
                (
                <Link className='search-player' key={index}>
                    <img src={q.avatar_link} alt='pfp'></img>
                    <span style={{fontSize:`${36 - q.user_name.length * 0.8}px`}}>{q.user_name}</span>
                </Link>
                
            )):""}

            </div>            
        </div>
    </div>
        )
}


