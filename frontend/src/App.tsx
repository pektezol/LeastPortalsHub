import React from 'react';
import { Routes, Route } from "react-router-dom";

import { UserProfile } from './types/Profile';
import Sidebar from './components/Sidebar';
import "./App.css";

import Profile from './pages/Profile';
import Games from './pages/Games';
import Maps from './pages/Maps';
import User from './pages/User';


const App: React.FC = () => {
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [profile, setProfile] = React.useState<UserProfile | undefined>(undefined);
  const [isModerator, setIsModerator] = React.useState<boolean>(true);

  // React.useEffect(() => {
  //   if (token) {
  //     setIsModerator(JSON.parse(atob(token.split(".")[1])).mod)
  //   }
  // }, [token]);

  return (
    <>
      <Sidebar setToken={setToken} profile={profile} setProfile={setProfile} />
      <Routes>
        <Route path="/" element={<div>yo</div>} />
        <Route path="/profile" element={<Profile profile={profile} />} />
        <Route path="/users/*" element={<User />} />
        <Route path="/games" element={<Games />} />
        <Route path="/maps/*" element={<Maps isModerator={isModerator} />} />
        <Route path="*" element={"404"} />
      </Routes>
    </>
  );
};

export default App;
