import React from 'react';

import "./sidebar.css";
import img0 from "../imgs/0.png"
import img1 from "../imgs/1.png"
import img2 from "../imgs/2.png"
import img3 from "../imgs/3.png"
import img4 from "../imgs/4.png"
import img5 from "../imgs/5.png"
import img6 from "../imgs/6.png"
import img7 from "../imgs/7.png"
import img8 from "../imgs/8.png"


export default function Sidebar() {
const sidebar_text = ['Home\u00A0page',"Profile","News","Records","Discussions","Leaderboards","Score\u00A0log"] // text on the buttons
const [sidebar, setSidebar] = React.useState();


// Locks button for 200ms before it can be clicked again, prevents spam
const [isLocked, setIsLocked] = React.useState(false);
function HandleLock(arg) {
if (!isLocked) {
    setIsLocked(true);
        setTimeout(() => setIsLocked(false), 200);
    SidebarHide(arg)
    }
}


// Clicked buttons
function SidebarClick(x){
const btn = document.querySelectorAll("button#side-grid");


sidebar_text.forEach((e,i) =>(
    btn[i].style.backgroundColor="#202232",
    btn[i].style.borderRadius="20px"
)) 

btn[x].style.backgroundColor="#141520"
btn[x].style.borderRadius="10px"
}


// The menu button
function SidebarHide(){
const btn   = document.querySelectorAll("button#side-grid");
const span  = document.querySelectorAll("#side-grid>span");
const side  = document.querySelector("#sidebar-list");

if(sidebar===1){
    setSidebar(0)
    side.style.width="308px"
    sidebar_text.forEach((e, i) =>(
        btn[i].style.width="300px",
        setTimeout(() => {span[i].style.opacity="1";span[i].textContent=e}, 200)
    ))
} else {
    side.style.width="40px";
    setSidebar(1)
    sidebar_text.forEach((e,i) =>(
        btn[i].style.width="40px",
        span[i].style.opacity="0",
        setTimeout(() => {span[i].textContent=""}, 100)
    )) 
    }
}

return (
<div id='sidebar'>
    <div>
        <img src={img0} alt="" width='320px' />
    </div>
    <div id='sidebar-list'>
        <button onClick={()=>HandleLock()} id='side-menu'><img src={img1} alt="" /></button>
            <p id='side-grid'></p> {/* p's are spaces between buttons */}
        <button onClick={()=>SidebarClick(0)} id='side-grid'><img src={img2} alt="" /><span>Home page</span></button>
        <button onClick={()=>SidebarClick(1)} id='side-grid'><img src={img3} alt="" /><span>Profile</span></button>
            <p id='side-grid'></p>
        <button onClick={()=>SidebarClick(2)} id='side-grid'><img src={img4} alt="" /><span>News</span></button>
        <button onClick={()=>SidebarClick(3)} id='side-grid'><img src={img5} alt="" /><span>Records</span></button>
        <button onClick={()=>SidebarClick(4)} id='side-grid'><img src={img6} alt="" /><span>Discussions</span></button>
            <p id='side-grid'></p>
        <button onClick={()=>SidebarClick(5)} id='side-grid'><img src={img7} alt="" /><span>Leaderboards</span></button>
        <button onClick={()=>SidebarClick(6)} id='side-grid'><img src={img8} alt="" /><span>Score&nbsp;log</span></button>
    </div>
    <div id='sidebar-content'>

    </div>
</div>
    )
}


