import React from 'react';
import { useLocation }  from "react-router-dom";
import ReactMarkdown from 'react-markdown'

import "./summary.css";

import img4 from "../../imgs/4.png"
import img5 from "../../imgs/5.png"
import img6 from "../../imgs/6.png"
import Modview from "./summary_modview.js"

export default function Summary(prop) {
const {token,mod} = prop
const fakedata={} //for debug   

    const location = useLocation()

    //fetching data
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        fetch(`https://lp.ardapektezol.com/api/v1/maps/${location.pathname.split('/')[2]}/summary`)
        .then(r => r.json())
        .then(d => {
            if(Object.keys(fakedata).length!==0){setData(fakedata)} 
            else{setData(d.data)}
            if(d.data.summary.routes.length===0){d.data.summary.routes[0]={"category": "","history": {"score_count": 0,},"rating": 0,"description": "","showcase": ""}} 
        })
        // eslint-disable-next-line
    }, []);





const [navState, setNavState] = React.useState(0); // eslint-disable-next-line
React.useEffect(() => {NavClick();}, [[],navState]);

function NavClick() {
    if(data!==null){
    const btn = document.querySelectorAll("#section2 button.nav-button");
    btn.forEach((e) => {e.style.backgroundColor = "#2b2e46"});
    btn[navState].style.backgroundColor = "#202232";
}}


const [catState, setCatState] = React.useState(1); // eslint-disable-next-line
React.useEffect(() => {CatClick();}, [[],catState]);

function CatClick() {
    if(data!==null){
    const btn = document.querySelectorAll("#section3 #category span button");
    btn.forEach((e) => {e.style.backgroundColor = "#2b2e46"});
    btn[catState-1].style.backgroundColor = "#202232";
}}
React.useEffect(()=>{
    if(data!==null && data.summary.routes.filter(e=>e.category.id===catState).length!==0){
        selectRun(0,catState)} // eslint-disable-next-line
},[catState,data])


const [hisState, setHisState] = React.useState(0); // eslint-disable-next-line
React.useEffect(() => {HisClick();}, [[],hisState]);

function HisClick() {
    if(data!==null){
    const btn = document.querySelectorAll("#section3 #history span button");
    btn.forEach((e) => {e.style.backgroundColor = "#2b2e46"});
    btn[hisState].style.backgroundColor = "#202232";
}}

const [selectedRun,setSelectedRun] = React.useState(0)

function selectRun(x,y){
    let r = document.querySelectorAll("button.record")
    r.forEach(e=>e.style.backgroundColor="#2b2e46")
    r[x].style.backgroundColor="#161723"


    if(data!==null && data.summary.routes.length!==0 && data.summary.routes.length!==0){
    if(y===2){x+=data.summary.routes.filter(e=>e.category.id<2).length}
    if(y===3){x+=data.summary.routes.filter(e=>e.category.id<3).length}
    if(y===4){x+=data.summary.routes.filter(e=>e.category.id<4).length}
    setSelectedRun(x)
    }
}

const [vid,setVid] = React.useState("")
React.useEffect(()=>{
    if(data!==null){
        let showcase = data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].showcase
        showcase.length>6 ? setVid("https://www.youtube.com/embed/"+YouTubeGetID(showcase))
        : setVid("")
    } // eslint-disable-next-line 
},[[],selectedRun])

function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_]/i)[0] : url[0];
 }

if(data!==null){
return (
    <>
        {token!==null?mod===true?<Modview selectedRun={selectedRun} data={data} token={token}/>:"":""}

        <div id='background-image'>
            <img src={data.map.image} alt="" />
        </div>
    <main>
        <section id='section1'>
            <div>
                <button className='nav-button'><i className='triangle'></i><span>{data.map.game_name}</span></button>
                <button className='nav-button'><i className='triangle'></i><span>{data.map.chapter_name}</span></button>
                <br/><span><b>{data.map.map_name}</b></span>
            </div>


        </section>

        <section id='section2'>
                <button className='nav-button' onClick={()=>setNavState(0)}><img src={img4} alt="" /><span>Summary</span></button>
                <button className='nav-button' onClick={()=>setNavState(1)}><img src={img5} alt="" /><span>Leaderboards</span></button>
                <button className='nav-button' onClick={()=>setNavState(2)}><img src={img6} alt="" /><span>Discussions</span></button>
        </section>

        <section id='section3'>
            <div id='category'
            style={data.map.image===""?{backgroundColor:"#202232"}:{}}>
                <img src={data.map.image} alt="" id='category-image'></img>
                <p><span className='portal-count'>{data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].history.score_count}</span>
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].history.score_count === 1 ? ` portal` : ` portals` }</p>
                <span>
                    <button onClick={()=>setCatState(1)}>CM</button>
                    <button onClick={()=>setCatState(2)}>NoSLA</button>
                    {data.map.is_coop?<button onClick={()=>setCatState(3)}>SLA</button>
                    :<button onClick={()=>setCatState(3)}>Inbounds SLA</button>}
                    <button onClick={()=>setCatState(4)}>Any%</button>
                </span>

            </div>
            
            <div id='history'>
                <div>
                    <div className='record-top'>
                        <span>Date</span>
                        <span>Record</span>
                        <span>First completion</span>
                    </div>
                    <hr/>
                    <div id='records'>

                    {data.summary.routes
                    .sort((a, b) => a.history.score_count - b.history.score_count)
                    .filter(e=>e.category.id===catState)
                    .map((r, index) => (
                        <button className='record' key={index} onClick={()=>{
                            selectRun(index,r.category.id);
                            }}>
                            <span>{ new Date(r.history.date).toLocaleDateString(
                                "en-US", { month: 'long', day: 'numeric', year: 'numeric' }
                            )}</span>
                            <span>{r.history.score_count}</span>
                            <span>{r.history.runner_name}</span>
                        </button>
                    ))}

                    </div>
                </div>
                    <span>
                        <button onClick={()=>setHisState(0)}>List</button>
                        <button onClick={()=>setHisState(1)}>Graph</button>
                    </span>
            </div>
                
        </section>

        <section id='section4'>
        <div id='difficulty'>
                <span>Difficulty</span>
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 0 ? (<span style={{color:"lime"}}>Very easy</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 1 ? (<span style={{color:"green"}}>Easy</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 2 ? (<span style={{color:"yellow"}}>Medium</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 3 ? (<span style={{color:"orange"}}>Hard</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 4 ? (<span style={{color:"red"}}>Very hard</span>):null}
                <div>
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 0 ? (<div className='difficulty-rating' style={{backgroundColor:"lime"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 1 ? (<div className='difficulty-rating' style={{backgroundColor:"green"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 2 ? (<div className='difficulty-rating' style={{backgroundColor:"yellow"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 3 ? (<div className='difficulty-rating' style={{backgroundColor:"orange"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 4 ? (<div className='difficulty-rating' style={{backgroundColor:"red"}}></div>) : (<div className='difficulty-rating'></div>)}
                </div>
            </div>
            <div id='count'>
                <span>Completion count</span>
                <div>6275</div>
            </div>
        </section>

        <section id='section5'>
            <div id='description'>
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].showcase!=="" ?
                <iframe title='Showcase video' src={vid}> </iframe>
                : ""}
                <h3>Route description</h3>
                <span id='description-text'>
                    <ReactMarkdown>
                        {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].description}
                    </ReactMarkdown>
                </span>
            </div>
            
        </section>
    </main>
    </>
    )
}else{
    return (
        <main></main>
    )
}


}


