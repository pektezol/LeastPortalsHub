import React from 'react';
import { UploadRunContent } from '../types/Content';

import '../css/UploadRunDialog.css';
import { Game } from '../types/Game';
import Games from '../pages/Games';
import { Map } from '../types/Map';
import { API } from '../api/Api';

interface UploadRunDialogProps {
  open: boolean;
  onClose: () => void;
  mapID?: number;
  games: Game[];
}

const UploadRunDialog: React.FC<UploadRunDialogProps> = ({ open, onClose, mapID, games }) => {

  const [uploadRunContent, setUploadRunContent] = React.useState<UploadRunContent>({
    map_id: 0,
    host_demo: null,
    partner_demo: null,
    partner_id: undefined,
    is_partner_orange: undefined,
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
      ...uploadRunContent,
      map_id: gameMaps[0].id,
    });
    _set_current_map(gameMaps[0].name);
    setSelectedGameID(parseInt(game_id) - 1);
    setSelectedGameName(game_name);
    setLoading(false);
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
              <div style={{padding: "15px 0px"}} className='upload-run-dropdown-container'>
                <h1 style={{paddingBottom: "14px"}}>Select Game</h1>
                <div onClick={() => _handle_dropdowns(1)} style={{display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between"}}>
                  <div className='dropdown-cur'>{selectedGameName}</div>
                  <i style={{rotate: "-90deg", transform: "translate(-5px, 10px)"}} className="triangle"></i>
                </div>
                <div className={dropdown1Vis ? "upload-run-dropdown" : "upload-run-dropdown hidden"}>
                  {games.map((game) => (
                    <div onClick={() => {_handle_game_select(game.id.toString(), game.name); _handle_dropdowns(1)}} key={game.id}>{game.name}</div>
                  ))}
                </div>
              </div>
              {
                !loading &&
                (
                  <>
                  <div className='upload-run-map-container' style={{paddingBottom: "10px"}}>
                    <div style={{padding: "15px 0px"}}>
                      <h1 style={{paddingBottom: "14px"}}>Select Map</h1>
                      <div onClick={() => _handle_dropdowns(2)} style={{display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between"}}>
                        <span style={{userSelect: "none"}}>{currentMap}</span>
                        <i style={{rotate: "-90deg", transform: "translate(-5px, 10px)"}} className="triangle"></i>
                      </div>
                    </div>
                    <div>
                      <div id='dropdown2' className={dropdown2Vis ? "upload-run-dropdown" : "upload-run-dropdown hidden"}>
                        {selectedGameMaps && selectedGameMaps.map((gameMap) => (
                          <div onClick={() => { setUploadRunContent({...uploadRunContent, map_id: parseInt(gameMap.name)}); _set_current_map(gameMap.name); _handle_dropdowns(2); }} key={gameMap.id}>{gameMap.name}</div>
                        ))}
                      </div>
                    </div>
                    <span>Host Demo</span>
                    <input type="file" name="host_demo" id="host_demo" accept=".dem" />
                    {
                      games[selectedGameID].is_coop &&
                      (
                        <>
                          <span>Partner Demo</span>
                          <input type="file" name="partner_demo" id="partner_demo" accept=".dem" />
                        </>
                      )
                    }
                    <div className='upload-run-buttons-container'>
                      <button onClick={() => onClose()}>Submit</button>
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