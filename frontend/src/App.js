import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Sidebar from "./components/sidebar.js"
import Main from "./components/main.js"
import "./App.css";

import Summary from "./components/pages/summary.js"
import Profile from "./components/pages/profile.js"
import About from './components/pages/about.js';
import Games from "./components/pages/games.js";
import Maplist from './components/pages/maplist.js';
import Home from "./components/pages/maplist.js";
import Homepage from './components/pages/home.js';


export default function App() {
    const [token, setToken] = React.useState(null);
    const [mod,setMod] = React.useState(false)
    React.useEffect(()=>{
        if(token!==null){
            setMod(JSON.parse(atob(token.split(".")[1])).mod)
        }
    },[token])

    return (
        <>
        <BrowserRouter>
        <Sidebar token={token} setToken={setToken}/>
        <Routes>
            <Route index element={<Homepage/>}></Route>
            <Route path="/news" element={<Main text="News"/>}></Route>
            <Route path="/records" element={<Main text="Records"/>}></Route>
            <Route path="/leaderboards" element={<Main text="Leaderboards"/>}></Route>
            <Route path="/discussions" element={<Main text="Discussion"/>}></Route>
            <Route path="/scorelog" element={<Main text="Score logs"/>}></Route>
            <Route path="/profile" element={<Profile token={token}/>}></Route>
            <Route path="/users/*" element={<Profile/>}></Route>
            <Route path="/rules" element={<Main text="Rules"/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/maps/*" element={<Summary token={token} mod={mod}/>}></Route>
            <Route path="/games" element={<Games/>}></Route>
            <Route path="/games/*" element={<Maplist token={token} mod={mod} />}></Route>
            <Route path="*" element={<Main text="404 Page not found"/>}></Route>
        </Routes>
        </BrowserRouter>
        </>
    )
}