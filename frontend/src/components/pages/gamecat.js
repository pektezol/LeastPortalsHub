import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

export default function GameCategory(prop) {
    const [iteration, setIteration] = React.useState(prop.iteration);
    const [category, setCategory] = React.useState(prop.cat);
    const [gameinfo, setGameinfo] = React.useState(prop.gameinfo);

    let cats = [
        1,
        2,
        3,
        4,
        1,
        2,
        3,
    ]

    return (
        <Link className='games-page-item-body-item' to={`/games/${gameinfo.id}?cat=${cats[iteration] - 1}`}>
            <div>
                <span className='games-page-item-body-item-title'>{category.category.name}</span><br></br>
                <span className='games-page-item-body-item-num'>{category.portal_count}</span>
            </div>
        </Link>
    )
}