import React from 'react';
import { useLocation } from 'react-router-dom';

import { SteamIcon, TwitchIcon, YouTubeIcon, PortalIcon, FlagIcon, StatisticsIcon, SortIcon, ThreedotIcon, DownloadIcon, HistoryIcon } from '../images/Images';
import { UserProfile } from '../types/Profile';
import { Game, GameChapters } from '../types/Game';
import { Map } from '../types/Map';
import { API } from '../api/Api';
import { ticks_to_time } from '../utils/Time';
import "../css/Profile.css";

const User: React.FC = () => {
  const location = useLocation();

  const [user, setUser] = React.useState<UserProfile | undefined>(undefined);

  const [navState, setNavState] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageMax, setPageMax] = React.useState(0);

  const [game, setGame] = React.useState("0")
  const [gameData, setGameData] = React.useState<Game[]>([]);
  const [chapter, setChapter] = React.useState("0")
  const [chapterData, setChapterData] = React.useState<GameChapters | null>(null);
  const [maps, setMaps] = React.useState<Map[]>([]);

  function NavClick() {
    if (user) {
      const btn = document.querySelectorAll("#section2 button");
      btn.forEach((e) => { (e as HTMLElement).style.backgroundColor = "#2b2e46" });
      (btn[navState] as HTMLElement).style.backgroundColor = "#202232";

      document.querySelectorAll("section").forEach((e, i) => i >= 2 ? e.style.display = "none" : "")
      if (navState === 0) { document.querySelectorAll(".profile1").forEach((e) => { (e as HTMLElement).style.display = "block" }); }
      if (navState === 1) { document.querySelectorAll(".profile2").forEach((e) => { (e as HTMLElement).style.display = "block" }); }
    }
  }

  function UpdateProfile() {
    fetch(`https://lp.ardapektezol.com/api/v1/profile`, {
      method: 'POST',
      headers: { Authorization: "" }
    }).then(r => r.json())
      .then(d => d.success ? window.alert("profile updated") : window.alert(`Error: ${d.message}`))
  }

  const _fetch_user = async () => {
    const userData = await API.get_user(location.pathname.split("/")[2]);
    setUser(userData);
  };

  React.useEffect(() => {
    fetch("https://lp.ardapektezol.com/api/v1/games")
      .then(r => r.json())
      .then(d => {
        setGameData(d.data)
        setGame("0")
      })

  }, [location]);

  React.useEffect(() => {
    if (user) {
      if (game && game !== "0") {
        fetch(`https://lp.ardapektezol.com/api/v1/games/${game}`)
          .then(r => r.json())
          .then(d => {
            setChapterData(d.data)
            setChapter("0");
            // (document.querySelector('#select-chapter') as HTMLInputElement).value = "0"
          })
  
      } else if (game && game === "0") {
        setPageMax(Math.ceil(user.records.length / 20))
        setPageNumber(1)
      }
    }
  }, [user, game, location]);

  React.useEffect(() => {
    _fetch_user();
  }, []);

  React.useEffect(() => {
    if (game !== "0") {
      if (chapter === "0") {
        fetch(`https://lp.ardapektezol.com/api/v1/games/${game}/maps`)
          .then(r => r.json())
          .then(d => {
            setMaps(d.data.maps);
            setPageMax(Math.ceil(d.data.maps.length / 20))
            setPageNumber(1)
          })
      } else {
        fetch(`https://lp.ardapektezol.com/api/v1/chapters/${chapter}`)
          .then(r => r.json())
          .then(d => {
            setMaps(d.data.maps);
            setPageMax(Math.ceil(d.data.maps.length / 20))
            setPageNumber(1)
          })

      }
    }
  }, [game, chapter, chapterData])

  if (!user) {
    return (
      <></>
    );
  };

  return (
    <main>
      <section id='section1' className='profile'>

        {user.profile
          ? (
            <div id='profile-image' onClick={() => UpdateProfile()}>
              <img src={user.avatar_link} alt="profile-image"></img>
              <span>Refresh</span>
            </div>
          ) : (
            <div>
              <img src={user.avatar_link} alt="profile-image"></img>
            </div>
          )}

        <div id='profile-top'>
          <div>
            <div>{user.user_name}</div>
            <div>
              {user.country_code === "XX" ? "" : <img src={`https://flagcdn.com/w80/${user.country_code.toLowerCase()}.jpg`} alt={user.country_code} />}
            </div>
            <div>
              {user.titles.map(e => (
                <span className="titles" style={{ backgroundColor: `#${e.color}` }}>
                  {e.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            {user.links.steam === "-" ? "" : <a href={user.links.steam}><img src={SteamIcon} alt="Steam" /></a>}
            {user.links.twitch === "-" ? "" : <a href={user.links.twitch}><img src={TwitchIcon} alt="Twitch" /></a>}
            {user.links.youtube === "-" ? "" : <a href={user.links.youtube}><img src={YouTubeIcon} alt="Youtube" /></a>}
            {user.links.p2sr === "-" ? "" : <a href={user.links.p2sr}><img src={PortalIcon} alt="P2SR" style={{ padding: "0" }} /></a>}
          </div>

        </div>
        <div id='profile-bottom'>
          <div>
            <span>Overall</span>
            <span>{user.rankings.overall.rank === 0 ? "N/A " : "#" + user.rankings.overall.rank + " "}
              <span>({user.rankings.overall.completion_count}/{user.rankings.overall.completion_total})</span>
            </span>
          </div>
          <div>
            <span>Singleplayer</span>
            <span>{user.rankings.singleplayer.rank === 0 ? "N/A " : "#" + user.rankings.singleplayer.rank + " "}
              <span>({user.rankings.singleplayer.completion_count}/{user.rankings.singleplayer.completion_total})</span>
            </span>
          </div>
          <div>
            <span>Cooperative</span>
            <span>{user.rankings.cooperative.rank === 0 ? "N/A " : "#" + user.rankings.cooperative.rank + " "}
              <span>({user.rankings.cooperative.completion_count}/{user.rankings.cooperative.completion_total})</span>
            </span>
          </div>
        </div>
      </section>


      <section id='section2' className='profile'>
        <button onClick={() => setNavState(0)}><img src={FlagIcon} alt="" />&nbsp;Player Records</button>
        <button onClick={() => setNavState(1)}><img src={StatisticsIcon} alt="" />&nbsp;Statistics</button>
      </section>





      <section id='section3' className='profile1'>
        <div id='profileboard-nav'>
          {gameData === null ? <select>error</select> :

            <select id='select-game'
              onChange={() => setGame((document.querySelector('#select-game') as HTMLInputElement).value)}>
              <option value={0} key={0}>All Scores</option>
              {gameData.map((e, i) => (
                <option value={e.id} key={i + 1}>{e.name}</option>
              ))}</select>
          }

          {game === "0" ?
            <select disabled>
              <option>All Scores</option>
            </select>
            : chapterData === null ? <select></select> :

              <select id='select-chapter'
                onChange={() => setChapter((document.querySelector('#select-chapter') as HTMLInputElement).value)}>
                <option value="0" key="0">All</option>
                {chapterData.chapters.filter(e => e.is_disabled === false).map((e, i) => (
                  <option value={e.id} key={i + 1}>{e.name}</option>
                ))}</select>
          }
        </div>
        <div id='profileboard-top'>
          <span><span>Map Name</span><img src={SortIcon} alt="" /></span>
          <span style={{ justifyContent: 'center' }}><span>Portals</span><img src={SortIcon} alt="" /></span>
          <span style={{ justifyContent: 'center' }}><span>WRΔ </span><img src={SortIcon} alt="" /></span>
          <span style={{ justifyContent: 'center' }}><span>Time</span><img src={SortIcon} alt="" /></span>
          <span> </span>
          <span><span>Rank</span><img src={SortIcon} alt="" /></span>
          <span><span>Date</span><img src={SortIcon} alt="" /></span>
          <div id='page-number'>
            <div>
              <button onClick={() => pageNumber === 1 ? null : setPageNumber(prevPageNumber => prevPageNumber - 1)}
              ><i className='triangle' style={{ position: 'relative', left: '-5px', }}></i> </button>
              <span>{pageNumber}/{pageMax}</span>
              <button onClick={() => pageNumber === pageMax ? null : setPageNumber(prevPageNumber => prevPageNumber + 1)}
              ><i className='triangle' style={{ position: 'relative', left: '5px', transform: 'rotate(180deg)' }}></i> </button>
            </div>
          </div>
        </div>
        <hr />
        <div id='profileboard-records'>

          {game === "0"
            ? (

              user.records.sort((a, b) => a.map_id - b.map_id)
                .map((r, index) => (

                  Math.ceil((index + 1) / 20) === pageNumber ? (
                    <button className="profileboard-record" key={index}>
                      {r.scores.map((e, i) => (<>
                        {i !== 0 ? <hr style={{ gridColumn: "1 / span 8" }} /> : ""}

                        <span>{r.map_name}</span>

                        <span style={{ display: "grid" }}>{e.score_count}</span>

                        <span style={{ display: "grid" }}>{e.score_count - r.map_wr_count}</span>
                        <span style={{ display: "grid" }}>{ticks_to_time(e.score_time)}</span>
                        <span> </span>
                        {i === 0 ? <span>#{r.placement}</span> : <span> </span>}
                        <span>{e.date.split("T")[0]}</span>
                        <span style={{ flexDirection: "row-reverse" }}>

                          <button onClick={() => { window.alert(`Demo ID: ${e.demo_id}`) }}><img src={ThreedotIcon} alt="demo_id" /></button>
                          <button onClick={() => window.location.href = `https://lp.ardapektezol.com/api/v1/demos?uuid=${e.demo_id}`}><img src={DownloadIcon} alt="download" /></button>
                          {i === 0 && r.scores.length > 1 ? <button onClick={() => {
                            (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height === "44px" ||
                              (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height === "" ?
                              (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height = `${r.scores.length * 46}px` :
                              (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height = "44px"
                          }
                          }><img src={HistoryIcon} alt="history" /></button> : ""}

                        </span>
                      </>))}

                    </button>
                  ) : ""
                ))) : maps ?

              maps.filter(e => e.is_disabled === false).sort((a, b) => a.id - b.id)
                .map((r, index) => {
                  if (Math.ceil((index + 1) / 20) === pageNumber) {
                    let record = user.records.find((e) => e.map_id === r.id);
                    return record === undefined ? (
                      <button className="profileboard-record" key={index} style={{ backgroundColor: "#1b1b20" }}>
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
                        {record.scores.map((e, i) => (<>
                          {i !== 0 ? <hr style={{ gridColumn: "1 / span 8" }} /> : ""}
                          <span>{r.name}</span>
                          <span style={{ display: "grid" }}>{record!.scores[i].score_count}</span>
                          <span style={{ display: "grid" }}>{record!.scores[i].score_count - record!.map_wr_count}</span>
                          <span style={{ display: "grid" }}>{ticks_to_time(record!.scores[i].score_time)}</span>
                          <span> </span>
                          {i === 0 ? <span>#{record!.placement}</span> : <span> </span>}
                          <span>{record!.scores[i].date.split("T")[0]}</span>
                          <span style={{ flexDirection: "row-reverse" }}>

                            <button onClick={() => { window.alert(`Demo ID: ${e.demo_id}`) }}><img src={ThreedotIcon} alt="demo_id" /></button>
                            <button onClick={() => window.location.href = `https://lp.ardapektezol.com/api/v1/demos?uuid=${e.demo_id}`}><img src={DownloadIcon} alt="download" /></button>
                            {i === 0 && record!.scores.length > 1 ? <button onClick={() => {
                              (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height === "44px" ||
                                (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height === "" ?
                                (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height = `${record!.scores.length * 46}px` :
                                (document.querySelectorAll(".profileboard-record")[index % 20] as HTMLInputElement).style.height = "44px"
                            }
                            }><img src={HistoryIcon} alt="history" /></button> : ""}

                          </span>
                        </>))}
                      </button>

                    )
                  } else { return null }
                }) : (<>{console.warn(maps)}</>)}
        </div>
      </section>
    </main>
  );
};

export default User;
