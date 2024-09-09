import React from 'react';
import { Routes, Route } from "react-router-dom";

import { UserProfile } from './types/Profile';
import Sidebar from './components/Sidebar';
import "./App.css";

import Profile from './pages/Profile';
import Games from './pages/Games';
import Maps from './pages/Maps';
import User from './pages/User';
import Homepage from './pages/Homepage';
import UploadRunDialog from './components/UploadRunDialog';
import About from './pages/About';
import { Game } from './types/Game';
import { API } from './api/Api';
import Maplist from './pages/Maplist';
import Rankings from './pages/Rankings';

const App: React.FC = () => {
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [profile, setProfile] = React.useState<UserProfile | undefined>(undefined);
  const [isModerator, setIsModerator] = React.useState<boolean>(true);

  const [games, setGames] = React.useState<Game[]>([]);

  const [uploadRunDialog, setUploadRunDialog] = React.useState<boolean>(false);
  const [uploadRunDialogMapID, setUploadRunDialogMapID] = React.useState<number | undefined>(undefined);

  // React.useEffect(() => {
  //   if (token) {
  //     setIsModerator(JSON.parse(atob(token.split(".")[1])).mod)
  //   }
  // }, [token]);

  const _fetch_games = async () => {
    const games = await API.get_games();
    setGames(games);
  };

  React.useEffect(() => {
    _fetch_games();
  }, []);

  if (!games) {
    return (
      <></>
    )
  };

  return (
    <>
      <UploadRunDialog open={uploadRunDialog} onClose={() => setUploadRunDialog(false)} mapID={uploadRunDialogMapID} games={games} />
      <Sidebar setToken={setToken} profile={profile} setProfile={setProfile} onUploadRun={() => setUploadRunDialog(true)} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<Profile profile={profile} />} />
        <Route path="/users/*" element={<User />} />
        <Route path="/games" element={<Games games={games} />} />
        <Route path='/games/:id' element={<Maplist />}></Route>
        <Route path="/maps/*" element={<Maps profile={profile} isModerator={isModerator} onUploadRun={(mapID) => {setUploadRunDialog(true);setUploadRunDialogMapID(mapID)}} />}/>
        <Route path="/about" element={<About />} />
        <Route path='/rankings' element={<Rankings></Rankings>}></Route>
        <Route path="*" element={"404"} />
      </Routes>
    </>
  );
};

export default App;
