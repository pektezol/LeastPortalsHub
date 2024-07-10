import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from "react-router-dom";

import "./news.css"

export default function News({newsInfo}) {
    // const { token } = prop
    const [news, setNews] = React.useState(null);
    const location = useLocation();

    return (
        <div className='news-container'>
            <div className='news-title-header'>
                <span className='news-title'>{newsInfo.title}</span>
            </div>
            <div className='news-description-div'>
                <span className='description'>{newsInfo.short_description}</span>
            </div>
        </div>
    )
}