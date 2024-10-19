import React from 'react';
import { UploadRunContent } from '../types/Content';
import { DemoMessages, ScoreboardTempUpdate, SourceDemoParser, UserMessage } from '@nekz/sdp';
import fs from 'fs';



import '../css/UploadRunDialog.css';
import { Game } from '../types/Game';
import { Map } from '../types/Map';
import { API } from '../api/Api';
import { useNavigate } from 'react-router-dom';
import { SvcUserMessage } from '@nekz/sdp/script/src/types/NetMessages';

interface UploadRunDialogProps {
  token?: string;
  open: boolean;
  onClose: () => void;
  games: Game[];
}

const UploadRunDialog: React.FC<UploadRunDialogProps> = ({ token, open, onClose, games }) => {

  const navigate = useNavigate();

  const [uploadRunContent, setUploadRunContent] = React.useState<UploadRunContent>({
    map_id: 0,
    host_demo: null,
    partner_demo: null,
    partner_id: undefined,
  });

  const [currentMap, setCurrentMap] = React.useState<string>("");

  const _set_current_map = (game_name: string) => {
    setCurrentMap(game_name);
  }

  const [selectedGameID, setSelectedGameID] = React.useState<number>(0);
  const [selectedGameMaps, setSelectedGameMaps] = React.useState<Map[]>([]);
  const [selectedGameName, setSelectedGameName] = React.useState<string>("");

  // dropdowns
  const [dropdown1Vis, setDropdown1Vis] = React.useState<boolean>(false);
  const [dropdown2Vis, setDropdown2Vis] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);

  const _handle_dropdowns = (dropdown: number) => {
    setDropdown1Vis(false);
    setDropdown2Vis(false);
    if (dropdown == 1) {
      setDropdown1Vis(!dropdown1Vis);
    } else if (dropdown == 2) {
      setDropdown2Vis(!dropdown2Vis);
      document.querySelector("#dropdown2")?.scrollTo(0, 0);
    }
  }

  const _handle_game_select = async (game_id: string, game_name: string) => {
    setLoading(true);
    const gameMaps = await API.get_game_maps(game_id);
    setSelectedGameMaps(gameMaps);
    setUploadRunContent({
      map_id: gameMaps[0].id,
      host_demo: null,
      partner_demo: null,
      partner_id: undefined,
    });
    _set_current_map(gameMaps[0].name);
    setSelectedGameID(parseInt(game_id) - 1);
    setSelectedGameName(game_name);
    setLoading(false);
  };

  const _handle_file_change = async (e: React.ChangeEvent<HTMLInputElement>, host: boolean) => {
    if (e.target.files) {
      if (host) {
        setUploadRunContent({
          ...uploadRunContent,
          host_demo: e.target.files[0],
        });
      } else {
        setUploadRunContent({
          ...uploadRunContent,
          partner_demo: e.target.files[0],
        });
      }
    }
  };

  const _upload_run = async () => {
    if (token) {
      if (games[selectedGameID].is_coop) {
        if (uploadRunContent.host_demo === null) {
          alert("You must select a host demo to upload.")
          return
        } else if (uploadRunContent.partner_demo === null) {
          alert("You must select a partner demo to upload.")
          return
        } else if (uploadRunContent.partner_id === undefined) {
          alert("You must specify your partner.")
          return
        }
      } else {
        if (uploadRunContent.host_demo === null) {
          alert("You must select a demo to upload.")
          return
        }
      }
      // const demo = SourceDemoParser.default()
      //   .setOptions({ packets: true })
      //   .parse(await uploadRunContent.host_demo.arrayBuffer());

      //   const scoreboardPacket = demo.findPacket(ScoreboardTempUpdate)
      //   if (scoreboardPacket) {
      //     console.log(scoreboardPacket)
      //   } else {
      //     console.log("couldnt find scoreboard packet")
      //   }
      if (window.confirm("Are you sure you want to submit this run to LPHUB?")) {
        const message = await API.post_record(token, uploadRunContent);
        alert(message);
        navigate(0);
        onClose();
      }
    }
  };

  React.useEffect(() => {
    if (open) {
      _handle_game_select("1", "Portal 2 - Singleplayer"); // a different approach?.
    }
  }, [open]);

  if (open) {
    return (
      <>
        <div id="upload-run-block" />
        <div id='upload-run-menu'>
          <div id='upload-run-menu-add'>
            <div id='upload-run-route-category'>
              <div style={{ padding: "15px 0px" }} className='upload-run-dropdown-container'>
                <h1 style={{ paddingBottom: "14px" }}>Select Game</h1>
                <div onClick={() => _handle_dropdowns(1)} style={{ display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between" }}>
                  <div className='dropdown-cur'>{selectedGameName}</div>
                  <i style={{ rotate: "-90deg", transform: "translate(-5px, 10px)" }} className="triangle"></i>
                </div>
                <div className={dropdown1Vis ? "upload-run-dropdown" : "upload-run-dropdown hidden"}>
                  {games.map((game) => (
                    <div onClick={() => { _handle_game_select(game.id.toString(), game.name); _handle_dropdowns(1) }} key={game.id}>{game.name}</div>
                  ))}
                </div>
              </div>
              {
                !loading &&
                (
                  <>
                    <div className='upload-run-map-container' style={{ paddingBottom: "10px" }}>
                      <div style={{ padding: "15px 0px" }}>
                        <h1 style={{ paddingBottom: "14px" }}>Select Map</h1>
                        <div onClick={() => _handle_dropdowns(2)} style={{ display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between" }}>
                          <span style={{ userSelect: "none" }}>{currentMap}</span>
                          <i style={{ rotate: "-90deg", transform: "translate(-5px, 10px)" }} className="triangle"></i>
                        </div>
                      </div>
                      <div>
                        <div id='dropdown2' className={dropdown2Vis ? "upload-run-dropdown" : "upload-run-dropdown hidden"}>
                          {selectedGameMaps && selectedGameMaps.map((gameMap) => (
                            <div onClick={() => { setUploadRunContent({ ...uploadRunContent, map_id: gameMap.id }); _set_current_map(gameMap.name); _handle_dropdowns(2); }} key={gameMap.id}>{gameMap.name}</div>
                          ))}
                        </div>
                      </div>
                      <span>Host Demo</span>
                      <input type="file" name="host_demo" id="host_demo" accept=".dem" onChange={(e) => _handle_file_change(e, true)} />
                      {
                        games[selectedGameID].is_coop &&
                        (
                          <>
                            <span>Partner Demo</span>
                            <input type="file" name="partner_demo" id="partner_demo" accept=".dem" onChange={(e) => _handle_file_change(e, false)} />
                            <span>Partner ID</span>
                            <input type="text" name="partner_id" id="partner_id" onChange={(e) => setUploadRunContent({
                              ...uploadRunContent,
                              partner_id: e.target.value,
                            })} />
                          </>
                        )
                      }
                      <div className='search-container'>

                      </div>
                      <div className='upload-run-buttons-container'>
                        <button onClick={_upload_run}>Submit</button>
                        <button onClick={() => onClose()}>Cancel</button>
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <></>
  );

};

export default UploadRunDialog;