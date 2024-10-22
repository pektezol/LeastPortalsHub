import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

import { UserProfile } from './types/Profile';
import Sidebar from './components/Sidebar';
import "./App.css";

import Profile from './pages/Profile';
import Games from './pages/Games';
import Maps from './pages/Maps';
import User from './pages/User';
import Homepage from './pages/Homepage';
import UploadRunDialog from './components/UploadRunDialog';
import Rules from './pages/Rules';
import About from './pages/About';
import { Game } from './types/Game';
import { API } from './api/Api';
import Maplist from './pages/Maplist';
import Rankings from './pages/Rankings';
import { get_user_id_from_token, get_user_mod_from_token } from './utils/Jwt';
import { MapDeleteEndpoint } from './types/Map';

const App: React.FC = () => {
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [profile, setProfile] = React.useState<UserProfile | undefined>(undefined);
  const [isModerator, setIsModerator] = React.useState<boolean>(false);

  const [msgIsOpen, setMsgIsOpen] = React.useState<boolean>(false);

  const [games, setGames] = React.useState<Game[]>([]);

  const [uploadRunDialog, setUploadRunDialog] = React.useState<boolean>(false);
  const [uploadRunDialogMapID, setUploadRunDialogMapID] = React.useState<number | undefined>(undefined);

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(false);
  const [currDeleteMapInfo, setCurrDeleteMapInfo] = React.useState<MapDeleteEndpoint>();

  const _fetch_token = async () => {
    const token = await API.get_token();
    setToken(token);
  };

  const _fetch_games = async () => {
    const games = await API.get_games();
    setGames(games);
  };

  const _set_profile = async (user_id: string | undefined) => {
    if (user_id) {
      setProfile({} as UserProfile); // placeholder before we call actual user profile
      const user = await API.get_profile(token!);
      setProfile(user);
    }
  };

  React.useEffect(() => {
    if (token === undefined) {
      setProfile(undefined);
      setIsModerator(false);
    } else {
      _set_profile(get_user_id_from_token(token))
      const modStatus = get_user_mod_from_token(token)
      if (modStatus) {
        setIsModerator(true);
      } else {
        setIsModerator(false);
      }
    }
  }, [token]);

  React.useEffect(() => {
    _fetch_token();
    _fetch_games();
  }, []);

  if (!games) {
    return (
      <></>
    )
  };

  return (
    <>
      <Sidebar setToken={setToken} profile={profile} setProfile={setProfile} onUploadRun={() => setUploadRunDialog(true)} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profile" element={<Profile profile={profile} token={token} gameData={games} onDeleteRecord={() => setConfirmDialogOpen(true)} />} />
        <Route path="/users/*" element={<User profile={profile} token={token} gameData={games} />} />
        <Route path="/games" element={<Games games={games} />} />
        <Route path='/games/:id' element={<Maplist />}></Route>
        <Route path="/maps/*" element={<Maps token={token} isModerator={isModerator} />}/>
        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
        <Route path='/rankings' element={<Rankings />}></Route>
        <Route path="*" element={"404"} />
      </Routes>
      <UploadRunDialog token={token} open={uploadRunDialog} onClose={(updateProfile) => {
        setUploadRunDialog(false);
        if (token) {
          _set_profile(get_user_id_from_token(token));
        }
      }} games={games} />
    </>
  );
};

export default App;
