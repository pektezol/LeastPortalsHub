import React from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import "./login.css";
import img1 from "../imgs/login.png"
import img2 from "../imgs/10.png"
import img3 from "../imgs/11.png"


export default function Login() {

const isLoggedIn = Cookies.get('token') !== undefined;

function logout() {
    Cookies.remove('token')
    window.location.href="/"
}

const [data, setData] = React.useState();
React.useEffect(() => {
    fetch(`/api/v1/profile`,{
        headers: {
			'Content-Type': 'application/json',
            Authorization: Cookies.get('token')
        }})
    .then(r => {console.log(r)})
    .then(d => {setData(d);console.log(d)})
    }, []);

return (
    <>
    {isLoggedIn ? (
    <Link to="/profile" tabIndex={-1} className='login'>
        <button>
            <img src={img2} alt="" />
            <span>Username</span>
        </button>
        <button onClick={logout}><img src={img3} alt="" /><span></span></button>
    </Link>
    ) : (
    <Link to="/api/v1/login" className='login'>
        <button>
            <img src={img2} alt="" />
            <span><img src={img1} alt="Sign in through Steam" /></span>
        </button>
        <button disabled><span></span></button>
    </Link>
    )}
     </>   
        )
}


