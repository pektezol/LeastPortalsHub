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

  const [selectedGameID, setSelectedGameID] = React.useState<number>(0);
  const [selectedGameMaps, setSelectedGameMaps] = React.useState<Map[]>([]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const _handle_game_select = async (game_id: string) => {
    setLoading(true);
    const gameMaps = await API.get_game_maps(game_id);
    setSelectedGameMaps(gameMaps);
    setUploadRunContent({
      ...uploadRunContent,
      map_id: gameMaps[0].id,
    });
    setSelectedGameID(parseInt(game_id) - 1);
    setLoading(false);
  };

  React.useEffect(() => {
    _handle_game_select("1"); // a different approach?
  }, []);

  if (open) {
    return (
      <>
        <div id="upload-run-block" />
        <div id='upload-run-menu'>
          <div id='upload-run-menu-add'>
            <div id='upload-run-route-category'>
              <span>Select Game</span>
              <select onChange={(e) => _handle_game_select(e.target.value)}>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
              {
                !loading &&
                (
                  <>
                    <span>Select Map</span>
                    <select onChange={(e) => setUploadRunContent({
                      ...uploadRunContent,
                      map_id: parseInt(e.target.value),
                    })}>
                      {selectedGameMaps && selectedGameMaps.map((gameMap) => (
                        <option key={gameMap.id} value={gameMap.id}>{gameMap.name}</option>
                      ))}
                    </select>
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
                    <button onClick={() => onClose()}>Submit</button>
                    <button onClick={() => onClose()}>Cancel</button>
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