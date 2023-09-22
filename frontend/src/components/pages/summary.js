import React from 'react';
import { useLocation }  from "react-router-dom";
import ReactMarkdown from 'react-markdown'

import "./summary.css";

import img4 from "../../imgs/4.png"
import img5 from "../../imgs/5.png"
import img6 from "../../imgs/6.png"
import img12 from "../../imgs/12.png"
import img13 from "../../imgs/13.png"
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

    const [pageNumber, setPageNumber] = React.useState(1);
    const [lbData, setLbData] = React.useState(null);
    React.useEffect(() => {
        fetch(`https://lp.ardapektezol.com/api/v1/maps/${location.pathname.split('/')[2]}/leaderboards?page=${pageNumber}`)
        .then(r => r.json())
        .then(d => setLbData(d))
        // eslint-disable-next-line
    }, [pageNumber]);



const [navState, setNavState] = React.useState(0); // eslint-disable-next-line
React.useEffect(() => {NavClick();}, [[],navState]);

function NavClick() {
    if(data!==null){
    const btn = document.querySelectorAll("#section2 button.nav-button");
    btn.forEach((e) => {e.style.backgroundColor = "#2b2e46"});
    btn[navState].style.backgroundColor = "#202232";

    document.querySelectorAll("section").forEach((e,i)=>i>=2?e.style.display="none":"")
    if(navState === 0){document.querySelectorAll(".summary1").forEach((e) => {e.style.display = "grid"});}
    if(navState === 1){document.querySelectorAll(".summary2").forEach((e) => {e.style.display = "block"});}
    if(navState === 2){document.querySelectorAll(".summary3").forEach((e) => {e.style.display = "block"});}
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

function graph(state) {
    // this is such a mess
    let graph = data.summary.routes.filter(e=>e.category.id===catState)
    let graph_score = []
    data.summary.routes.filter(e=>e.category.id===catState).forEach(e=>graph_score.push(e.history.score_count))
    let graph_dates = []
    data.summary.routes.filter(e=>e.category.id===catState).forEach(e=>graph_dates.push(e.history.date.split("T")[0]))
    let graph_max = graph[graph.length-1].history.score_count
    let graph_numbers = []
    for (let i=graph_max;i>=0;i--){
        graph_numbers[i]=i
    }

    switch (state) {
        case 1: //numbers
            return graph_numbers
            .reverse().map(e=>(
                graph_score.includes(e) || e===0 ?
                <span>{e}<br/></span>
                :
                <span><br/></span>
                ))
        case 2: // graph
        let g = 0
        let h = 0
        return  graph_numbers.map((e,j)=>(
            <tr id={'graph_row-'+(graph_max-j)}
            data-graph={ graph_score.includes(graph_max-j) ? g++ : 0}
            data-graph2={h=0}
            
            >
                {
                    graph_score.map((e,i)=>(                    
                    <>
                        <td className='graph_ver'
                        data-graph={ h++ }
                        style={{outline: 
                             g===h-1 ? 
                             "1px solid #2b2e46" : g>=h ? "1px dashed white" : "0" }}
                        ></td>
                        
                        {g===h && graph_score.includes(graph_max-j) ? 
                        <button className='graph-button'
                        onClick={()=>{
                            selectRun(graph_dates.length-(i-1),catState);
                            }}
                        style={{left: `calc(100% / ${graph_dates.length} * ${h-1})`}}
                        ></button> 
                        : ""}
                        
                        <td className='graph_hor' id={'graph_table-'+i++}
                        style={{
                            outline: 
                            graph_score.includes(graph_max-j) ? 
                            g>=h ? 
                            g-1>=h ? "1px dashed #2b2e46" : "1px solid white" : "0"  
                            : "0"}}
                        ></td>

                        

                        <td className='graph_hor' id={'graph_table-'+i++}
                        style={{outline: 
                            graph_score.includes(graph_max-j) ?
                            g>=h ? 
                            g-1>=h ? "1px dashed #2b2e46" : "1px solid white" : "0"  
                            : "0"}}
                        ></td>

                    </>
                    ))
                    
                }
                
            </tr>
        )) 

        case 3: // dates
                return graph_dates
                .reverse().map(e=>(
                    <span>{e}</span>
                    ))
            default:
                break;

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

function TimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {return interval + ' years ago';}
  
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {return interval + ' months ago';}
  
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {return interval + ' days ago';}
  
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {return interval + ' hours ago';}
  
    interval = Math.floor(seconds / 60);
    if (interval > 1) {return interval + ' minutes ago';}
  
    if(seconds < 10) return 'just now';
  
    return Math.floor(seconds) + ' seconds ago';
  };

function TicksToTime(ticks) {

    let seconds = Math.floor(ticks/60)
    let minutes = Math.floor(seconds/60)
    let hours = Math.floor(minutes/60)

    let milliseconds = Math.floor((ticks%60)*1000/60)
    seconds = seconds % 60;
    minutes = minutes % 60;

  return `${hours===0?"":hours+":"}${minutes===0?"":hours>0?minutes.toString().padStart(2, '0')+":":(minutes+":")}${minutes>0?seconds.toString().padStart(2, '0'):seconds}.${milliseconds.toString().padStart(3, '0')} (${ticks})`;
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
        <section id='section3' className='summary1'>
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

                <div style={{display: hisState ? "none" : "block"}}>
                {data.summary.routes.filter(e=>e.category.id===catState).length===0 ? <h5>There are no records for this map.</h5> : 
                    <>
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
                    </>
                    }
                    </div>

                    <div style={{display: hisState ? "block" : "none"}}>
                        {data.summary.routes.filter(e=>e.category.id===catState).length===0 ? <h5>There are no records for this map.</h5> : 
                        <div id='graph'>
                            <div>{graph(1)}</div>
                            <div>{graph(2)}</div>
                            <div>{graph(3)}</div>
                        </div>
                            }
                    </div> 
                    <span>
                        <button onClick={()=>setHisState(0)}>List</button>
                        <button onClick={()=>setHisState(1)}>Graph</button>
                    </span>
                </div>
                
                
        </section>
        <section id='section4' className='summary1'>
        <div id='difficulty'>
                <span>Difficulty</span>
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 0 ? (<span>N/A</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 1 ? (<span style={{color:"lime"}}>Very easy</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 2 ? (<span style={{color:"green"}}>Easy</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 3 ? (<span style={{color:"yellow"}}>Medium</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 4 ? (<span style={{color:"orange"}}>Hard</span>):null}
                {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 5 ? (<span style={{color:"red"}}>Very hard</span>):null}
                <div>
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 1 ? (<div className='difficulty-rating' style={{backgroundColor:"lime"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 2 ? (<div className='difficulty-rating' style={{backgroundColor:"green"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 3 ? (<div className='difficulty-rating' style={{backgroundColor:"yellow"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 4 ? (<div className='difficulty-rating' style={{backgroundColor:"orange"}}></div>) : (<div className='difficulty-rating'></div>)}
                    {data.summary.routes.sort((a,b)=>a.category.id - b.category.id)[selectedRun].rating === 5 ? (<div className='difficulty-rating' style={{backgroundColor:"red"}}></div>) : (<div className='difficulty-rating'></div>)}
                </div>
            </div>
            <div id='count'>
                <span>Completion count</span>
                <div>{catState===1?data.summary.routes[selectedRun].completion_count:"N/A"}</div>
            </div>
        </section>

        <section id='section5' className='summary1'>
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

        {lbData===null?"":lbData.success===false?(
            <section id='section6' className='summary2'>
                <h1 style={{textAlign:"center"}}>Map is not available for competitive boards.</h1>
            </section>
        ):lbData.data.records.length===0?(
            <section id='section6' className='summary2'>
            <h1 style={{textAlign:"center"}}>No records found.</h1>
        </section>
        ):(
        <section id='section6' className='summary2'>
            
            <div id='leaderboard-top'
            style={lbData.data.map.is_coop?{gridTemplateColumns:"7.5% 40% 7.5% 15% 15% 15%"}:{gridTemplateColumns:"7.5% 30% 10% 20% 17.5% 15%"}}
            >
                <span>Place</span>
                
                {lbData.data.map.is_coop?(
                    <div id='runner'>
                        <span>Host</span>
                        <span>Partner</span>
                    </div>
                ):(
                    <span>Runner</span>
                )}
                
                <span>Portals</span>
                <span>Time</span>
                <span>Date</span>
                <div id='page-number'>
                    <div>

                    <button onClick={() => pageNumber === 1 ? null : setPageNumber(prevPageNumber => prevPageNumber - 1)}
                    ><i className='triangle' style={{position:'relative',left:'-5px',}}></i> </button>
                    <span>{lbData.data.pagination.current_page}/{lbData.data.pagination.total_pages}</span>
                    <button onClick={() => pageNumber === lbData.data.pagination.total_pages ? null : setPageNumber(prevPageNumber => prevPageNumber + 1)}
                    ><i className='triangle' style={{position:'relative',left:'5px',transform:'rotate(180deg)'}}></i> </button>
                    </div>
                </div>
            </div>
            <hr/>
            <div id='leaderboard-records'>
            {lbData.data.records.map((r, index) => (
                    <span className='leaderboard-record' key={index} 
                    style={lbData.data.map.is_coop?{gridTemplateColumns:"3% 4.5% 40% 4% 3.5% 15% 15% 14.5%"}:{gridTemplateColumns:"3% 4.5% 30% 4% 6% 20% 17% 15%"}}
                    >
                        <span>{r.placement}</span>
                        <span> </span>
                        {lbData.data.map.is_coop?(
                        <div>
                            <span><img src={r.host.avatar_link} alt='' /> &nbsp; {r.host.user_name}</span>
                            <span><img src={r.partner.avatar_link} alt='' /> &nbsp; {r.partner.user_name}</span>
                        </div>
                        ):(
                        <div><span><img src={r.user.avatar_link} alt='' /> &nbsp; {r.user.user_name}</span></div>
                        )}
                        
                        <span>{r.score_count}</span>
                        <span> </span>
                        <span>{TicksToTime(r.score_time)}</span>
                        <span className='hover-popup' popup-text={r.record_date.replace("T",' ').split(".")[0]}>{ TimeAgo(new Date(r.record_date.replace("T"," ").replace("Z",""))) }</span>
                        
                        {lbData.data.map.is_coop?(
                        <span>
                            <button onClick={()=>{window.alert(`Host demo ID: ${r.host_demo_id} \nParnter demo ID: ${r.partner_demo_id}`)}}><img src={img13} alt="demo_id" /></button>
                            <button onClick={()=>window.location.href=`https://lp.ardapektezol.com/api/v1/demos?uuid=${r.partner_demo_id}`}><img src={img12} alt="download" style={{filter:"hue-rotate(160deg) contrast(60%) saturate(1000%)"}}/></button>
                            <button onClick={()=>window.location.href=`https://lp.ardapektezol.com/api/v1/demos?uuid=${r.host_demo_id}`}><img src={img12} alt="download" style={{filter:"hue-rotate(300deg) contrast(60%) saturate(1000%)"}}/></button>
                        </span>
                        ):(

                        <span>
                            <button onClick={()=>{window.alert(`Demo ID: ${r.demo_id}`)}}><img src={img13} alt="demo_id" /></button>
                            <button onClick={()=>window.location.href=`https://lp.ardapektezol.com/api/v1/demos?uuid=${r.demo_id}`}><img src={img12} alt="download" /></button>
                        </span>
                            )}
                    {console.log(lbData)}
                    </span>
                    ))}
            </div>
        </section>
        )}

    </main>
    </>
    )
}else{
    return (
        <main></main>
    )
}


}


