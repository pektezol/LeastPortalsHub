import React from 'react';
import { Link } from "react-router-dom";

import "./login.css";
import img1 from "../imgs/login.png"
import img2 from "../imgs/10.png"
import img3 from "../imgs/11.png"


export default function Login(prop) {
const {setToken,profile,setProfile} = prop
function login() {
    window.location.href="https://lp.ardapektezol.com/api/v1/login"
}
function logout() {
    setIsLoggedIn(false)
    setProfile(null)
    setToken(null)
    fetch(`https://lp.ardapektezol.com/api/v1/token`,{'method':'DELETE'})
    .then(r=>window.location.href="/")
}
const [isLoggedIn, setIsLoggedIn] = React.useState(false);
React.useEffect(() => {
    fetch(`https://lp.ardapektezol.com/api/v1/token`)
    .then(r => r.json())
    .then(d => setToken(d.data.token))
    }, []);


React.useEffect(() => {
    if(profile!==null){setIsLoggedIn(true)}
    }, [profile]);

return (
    <>
    {isLoggedIn ? (
    <Link to="/profile" tabIndex={-1} className='login'>
        <button className='sidebar-button'>
            <img src={profile.avatar_link} alt="" />
            <span>{profile.user_name}</span>
        </button>
        <button className='sidebar-button' onClick={logout}><img src={img3} alt="" /><span></span></button>
    </Link>
    ) : (
    <Link tabIndex={-1} className='login' >
        <button className='sidebar-button' onClick={login}>
            <img src={img2} alt="" />
            <span><img src={img1} alt="Sign in through Steam" /></span>
        </button>
        <button className='sidebar-button' disabled><span></span></button>
    </Link>
    )}
     </>   
        )
}


