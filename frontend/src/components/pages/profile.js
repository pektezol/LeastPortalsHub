import React from 'react';
import { useLocation }  from "react-router-dom";

import img4 from "../../imgs/4.png"
import img5 from "../../imgs/5.png"
import img12 from "../../imgs/12.png"
import img13 from "../../imgs/13.png"
import img14 from "../../imgs/14.png"
import img15 from "../../imgs/15.png"
import img16 from "../../imgs/16.png"
import img17 from "../../imgs/17.png"
import img18 from "../../imgs/18.png"
import img19 from "../../imgs/19.png"
import "./profile.css";

export default function Profile(props) {
const {token} = props


const location = useLocation()


const [profileData, setProfileData] = React.useState(null)
React.useEffect(()=>{
    setProfileData(null)
    setChapterData(null)
    setMaps(null)
    setPageNumber(1)

    if(location.pathname==="/profile"){
            fetch(`https://lp.ardapektezol.com/api/v1/${location.pathname}`,{
                headers: {
                    'Authorization': token
                }})
                .then(r=>r.json())
                .then(d=>{
                    setProfileData(d.data)
                    setPageMax(Math.ceil(d.data.records.length/20))
                })
        }else{
            fetch(`https://lp.ardapektezol.com/api/v1/${location.pathname}`)
                .then(r=>r.json())
                .then(d=>{
                    setProfileData(d.data)
                    setPageMax(Math.ceil(d.data.records.length/20))
                })
            }
},[location.pathname])



const [game,setGame] = React.useState(0)
const [gameData,setGameData] = React.useState(null)
const [chapter,setChapter] = React.useState("0")
const [chapterData,setChapterData] = React.useState(null)
const [maps,setMaps] = React.useState(null)

React.useEffect(()=>{
    fetch("https://lp.ardapektezol.com/api/v1/games")
    .then(r=>r.json())
    .then(d=>{
        setGameData(d.data)
        setGame(0)
    })

},[location])

React.useEffect(()=>{
    if(game!==null && game!= 0){
        fetch(`https://lp.ardapektezol.com/api/v1/games/${game}`)
        .then(r=>r.json())
        .then(d=>{
            setChapterData(d.data)
            setChapter("0")
            document.querySelector('#select-chapter').value=0
        })

    } else if (game!==null && game==0 && profileData!== null){
        setPageMax(Math.ceil(profileData.records.length/20))
        setPageNumber(1)
    }

},[game,location])

React.useEffect(()=>{
    if(chapter!==null){
        if(chapter==0){
            setMaps(null)
            fetch(`https://lp.ardapektezol.com/api/v1/games/${game}/maps`)
            .then(r=>r.json())
            .then(d=>{
                setMaps(d.data.maps);
                setPageMax(Math.ceil(d.data.maps.length/20))
                setPageNumber(1)
                })
        }else{
            setMaps(null)
            fetch(`https://lp.ardapektezol.com/api/v1/chapters/${chapter}`)
            .then(r=>r.json())
            .then(d=>{
                setMaps(d.data.maps);
                setPageMax(Math.ceil(d.data.maps.length/20))
                setPageNumber(1)
                })
            
        }
    }
},[chapter,chapterData])



const [pageNumber, setPageNumber] = React.useState(1); 
const [pageMax, setPageMax] = React.useState(0); 
const [navState, setNavState] = React.useState(0); // eslint-disable-next-line
React.useEffect(() => {NavClick();}, [[],navState]);
function NavClick() {
    if(profileData!==null){
    const btn = document.querySelectorAll("#section2 button");
    btn.forEach((e) => {e.style.backgroundColor = "#2b2e46"});
    btn[navState].style.backgroundColor = "#202232";

    document.querySelectorAll("section").forEach((e,i)=>i>=2?e.style.display="none":"")
    if(navState === 0){document.querySelectorAll(".profile1").forEach((e) => {e.style.display = "block"});}
    if(navState === 1){document.querySelectorAll(".profile2").forEach((e) => {e.style.display = "block"});}
}
}
function UpdateProfile(){
    fetch(`https://lp.ardapektezol.com/api/v1/profile`,{
      method: 'POST',
      headers: {Authorization: token}
    }).then(r=>r.json())
    .then(d=>d.success?window.location.reload():window.alert(`Error: ${d.message}`))
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


if(profileData!==null){
return (
    <main>
        <section id='section1' className='profile'>

            {profileData.profile?(
                <div id='profile-image' onClick={()=>UpdateProfile()}>
                    <img src={profileData.avatar_link} alt=""></img>
                    <span>Refresh</span>
                </div>
                ):(
                <div>
                    <img src={profileData.avatar_link} alt=""></img>
                </div>
                )}

            <div id='profile-top'>
                <div>
                    <div>{profileData.user_name}</div>
                    <div>
                        {profileData.country_code==="XX"?"":<img src={`https://flagcdn.com/w80/${profileData.country_code.toLowerCase()}.jpg`} alt={profileData.country_code} />}
                    </div>
                    <div>
                    {profileData.titles.map(e=>(
                        <span className="titles" style={{backgroundColor:`#${e.color}`}}>
                            {e.name}
                        </span>
                    ))}
                    </div>
                </div>
                <div>
                    {profileData.links.p2sr==="-"?"":<a href={profileData.links.p2sr}><img src={img17} alt="Steam" /></a>}
                    {profileData.links.p2sr==="-"?"":<a href={profileData.links.p2sr}><img src={img15} alt="Twitch" /></a>}
                    {profileData.links.p2sr==="-"?"":<a href={profileData.links.p2sr}><img src={img16} alt="Youtube" /></a>}
                    {profileData.links.p2sr==="-"?"":<a href={profileData.links.p2sr}><img src={img4} alt="P2SR" style={{padding:"0"}} /></a>}
                </div>

            </div>
            <div id='profile-bottom'>
                <div>
                    <span>Overall</span>
                    <span>{profileData.rankings.overall.rank===0?"N/A ":"#"+profileData.rankings.overall.rank+" "} 
                        <span>({profileData.rankings.overall.completion_count}/{profileData.rankings.overall.completion_total})</span>
                    </span>
                </div>
                <div>
                    <span>Singleplayer</span>
                    <span>{profileData.rankings.singleplayer.rank===0?"N/A ":"#"+profileData.rankings.singleplayer.rank+" "} 
                        <span>({profileData.rankings.singleplayer.completion_count}/{profileData.rankings.singleplayer.completion_total})</span>
                    </span>
                </div>                
                <div>
                    <span>Cooperative</span>
                    <span>{profileData.rankings.cooperative.rank===0?"N/A ":"#"+profileData.rankings.cooperative.rank+" "} 
                        <span>({profileData.rankings.cooperative.completion_count}/{profileData.rankings.cooperative.completion_total})</span>
                    </span>
                </div>
            </div>
        </section>


        <section id='section2' className='profile'>
            <button onClick={()=>setNavState(0)}><img src={img5} alt="" />&nbsp;Player Records</button>
            <button onClick={()=>setNavState(1)}><img src={img14} alt="" />&nbsp;Statistics</button>
        </section>





        <section id='section3' className='profile1'>
            <div id='profileboard-nav'>
                {gameData===null?<select>error</select>:

                    <select id='select-game' 
                    onChange={()=>setGame(document.querySelector('#select-game').value)}>
                        <option value={0} key={0}>All Scores</option>
                    {gameData.map((e,i)=>(
                        <option value={e.id} key={i+1}>{e.name}</option>
                        ))}</select>
                    }
                
                {game==0? 
                <select disabled>
                    <option>All Scores</option>
                </select>
                :chapterData===null?<select></select>:
                    
                    <select id='select-chapter'
                    onChange={()=>setChapter(document.querySelector('#select-chapter').value)}>
                    <option value="0" key="0">All</option>
                    {chapterData.chapters.filter(e=>e.is_disabled===false).map((e,i)=>(
                        <option value={e.id} key={i+1}>{e.name}</option>
                        ))}</select>
                    }
            </div>
            <div id='profileboard-top'>
                <span><span>Map Name</span><img src={img19} alt="" /></span>
                <span style={{justifyContent:'center'}}><span>Portals</span><img src={img19} alt="" /></span>
                <span style={{justifyContent:'center'}}><span>WRΔ </span><img src={img19} alt="" /></span>
                <span style={{justifyContent:'center'}}><span>Time</span><img src={img19} alt="" /></span>
                <span> </span>
                <span><span>Rank</span><img src={img19} alt="" /></span>
                <span><span>Date</span><img src={img19} alt="" /></span>
                <div id='page-number'>
                    <div>
                        <button onClick={() => pageNumber === 1 ? null : setPageNumber(prevPageNumber => prevPageNumber - 1)}
                        ><i className='triangle' style={{position:'relative',left:'-5px',}}></i> </button>
                        <span>{pageNumber}/{pageMax}</span>
                        <button onClick={() => pageNumber === pageMax? null : setPageNumber(prevPageNumber => prevPageNumber + 1)}
                        ><i className='triangle' style={{position:'relative',left:'5px',transform:'rotate(180deg)'}}></i> </button>
                    </div>
                </div>
            </div>
            <hr/>
            <div id='profileboard-records'>

            {game == 0 && profileData !== null
  ?   (
    
    profileData.records.sort((a,b)=>a.map_id - b.map_id)
    .map((r, index) => (
        
        Math.ceil((index+1)/20)===pageNumber ? (
    <button className="profileboard-record" key={index}>
    {r.scores.map((e,i)=>(<>
    {i!==0?<hr style={{gridColumn:"1 / span 8"}}/>:""}
    
      <span>{r.map_name}</span>
        
      <span style={{ display: "grid" }}>{e.score_count}</span>

      <span style={{ display: "grid" }}>{e.score_count-r.map_wr_count}</span>
      <span style={{ display: "grid" }}>{TicksToTime(e.score_time)}</span>
      <span> </span>
      {i===0?<span>#{r.placement}</span>:<span> </span>}
      <span>{e.date.split("T")[0]}</span>
      <span style={{ flexDirection: "row-reverse" }}>

        <button onClick={()=>{window.alert(`Demo ID: ${e.demo_id}`)}}><img src={img13} alt="demo_id" /></button>
        <button onClick={()=>window.location.href=`https://lp.ardapektezol.com/api/v1/demos?uuid=${e.demo_id}`}><img src={img12} alt="download" /></button>
          {i===0&&r.scores.length>1?<button onClick={()=>
            {
                document.querySelectorAll(".profileboard-record")[index%20].style.height==="44px"||
                document.querySelectorAll(".profileboard-record")[index%20].style.height===""?
                document.querySelectorAll(".profileboard-record")[index%20].style.height=`${r.scores.length*46}px`:
                document.querySelectorAll(".profileboard-record")[index%20].style.height="44px"
            }
          }><img src={img18} alt="history" /></button>:""}

      </span>
      </>))}

    </button>
        ) : ""
  ))) : maps !== null  ? 
 
   maps.filter(e=>e.is_disabled===false).sort((a,b)=>a.id - b.id)
  .map((r, index) => {
    if(Math.ceil((index+1)/20)===pageNumber){
      let record = profileData.records.find((e) => e.map_id === r.id);
      return record === undefined ? (
        <button className="profileboard-record" key={index} style={{backgroundColor:"#1b1b20"}}>
          <span>{r.name}</span>
          <span style={{ display: "grid" }}>N/A</span>
          <span style={{ display: "grid" }}>N/A</span>
          <span>N/A</span>
          <span> </span>
          <span>N/A</span>
          <span>N/A</span>
          <span style={{ flexDirection: "row-reverse" }}></span>
        </button>
      ) : (
          <button className="profileboard-record" key={index}>
          {record.scores.map((e,i)=>(<>
                {i!==0?<hr style={{gridColumn:"1 / span 8"}}/>:""}
          <span>{r.name}</span>
          <span style={{ display: "grid" }}>{record.scores[i].score_count}</span>
          <span style={{ display: "grid" }}>{record.scores[i].score_count-record.map_wr_count}</span>
          <span>{TicksToTime(record.scores[i].score_time)}</span>
          <span> </span>
          {i===0?<span>#{record.placement}</span>:<span> </span>}
          <span>{record.scores[i].date.split("T")[0]}</span>
          <span style={{ flexDirection: "row-reverse" }}>

            <button onClick={()=>{window.alert(`Demo ID: ${e.demo_id}`)}}><img src={img13} alt="demo_id" /></button>
            <button onClick={()=>window.location.href=`https://lp.ardapektezol.com/api/v1/demos?uuid=${e.demo_id}`}><img src={img12} alt="download" /></button>
              {i===0&&record.scores.length>1?<button onClick={()=>
                {
                    document.querySelectorAll(".profileboard-record")[index%20].style.height==="44px"||
                    document.querySelectorAll(".profileboard-record")[index%20].style.height===""?
                    document.querySelectorAll(".profileboard-record")[index%20].style.height=`${record.scores.length*46}px`:
                    document.querySelectorAll(".profileboard-record")[index%20].style.height="44px"
                }
              }><img src={img18} alt="history" /></button>:""}

            </span>
            </>))}
        </button>

      )
      }else{return null}
    }):(<>{console.warn(maps)}</>)}
            </div>
        </section>

    </main>
)}
}
    

