import React from 'react';
import { Link } from "react-router-dom";

import "./login.css";
import img1 from "../imgs/login.png"
import img2 from "../imgs/10.png"
import img3 from "../imgs/11.png"


export default function Login() {

function login() {
    window.location.href="https://lp.ardapektezol.com/api/v1/login"
}
function logout() {
    fetch(`/api/v1/token`,{'method':'DELETE'})
    setToken(null)
    setIsLoggedIn(false)
    window.location.href="/"
}
const [token, setToken] = React.useState(null);
const [isLoggedIn, setIsLoggedIn] = React.useState(false);
React.useEffect(() => {
    fetch(`/api/v1/token`)
    .then(r => r.json())
    .then(d => setToken(d.data.token))
    }, []);

const [profile, setProfile] = React.useState(undefined);
React.useEffect(() => {
    fetch(`/api/v1/profile`,{
        headers: {
			'Content-Type': 'application/json',
            Authorization: token
        }})
    .then(r => r.json())
    .then(d => {
        console.log("data:", d);
        setProfile(d.data);
        console.log("profile:", profile);
      })
      .catch(error => {
        console.log("error:", error);
      });
    }, [token]);


return (
    <>
    {isLoggedIn ? (
    <Link to="/profile" tabIndex={-1} className='login'>
        <button>
            {/* <img src={profile.avatar_link} alt="" /> */}
            <img src={img2} alt="" />
            {/* <span>{profile.user_name}</span> */}
            <span>Username</span>
        </button>
        <button onClick={logout}><img src={img3} alt="" /><span></span></button>
    </Link>
    ) : (
    <Link tabIndex={-1} className='login'>
        <button onClick={login}>
            <img src={img2} alt="" />
            <span><img src={img1} alt="Sign in through Steam" /></span>
        </button>
        <button disabled><span></span></button>
    </Link>
    )}
     </>   
        )
}


