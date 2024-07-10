import React from 'react';

import "../App.css"
import "./main.css";
import { Link } from 'react-router-dom';

export default function Main(props) {


return (
    <main>
        <h1>{props.text}</h1>
    </main>
        )
}


